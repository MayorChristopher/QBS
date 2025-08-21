import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { QueueSimulator, type SimulationParams, type SimulationProgress } from "@/lib/simulation/queue-simulator"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const { name, description, arrivalRate, serviceRate, numServers, duration } = body

  // Validate input parameters
  if (!name || !arrivalRate || !serviceRate || !numServers || !duration) {
    return new Response("Missing required parameters", { status: 400 })
  }

  if (arrivalRate <= 0 || serviceRate <= 0 || numServers <= 0 || duration <= 0) {
    return new Response("All parameters must be positive", { status: 400 })
  }

  if (numServers > 20 || duration > 1440) {
    return new Response("Parameter limits exceeded", { status: 400 })
  }

  // Create Server-Sent Events stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      const sendEvent = (data: any, event?: string) => {
        const message = `${event ? `event: ${event}\n` : ""}data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      try {
        console.log("[QBS] Starting streamed simulation for user:", user.id)

        // Create simulation run record
        const { data: simulationRun, error: insertError } = await supabase
          .from("simulation_runs")
          .insert({
            user_id: user.id,
            name,
            description,
            arrival_rate: arrivalRate,
            service_rate: serviceRate,
            num_servers: numServers,
            simulation_duration: duration,
            status: "running",
            started_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          sendEvent({ error: "Failed to create simulation run" }, "error")
          controller.close()
          return
        }

        sendEvent({ simulationId: simulationRun.id, status: "started" }, "start")

        // Run the simulation with progress callback
        const params: SimulationParams = {
          arrivalRate,
          serviceRate,
          numServers,
          duration,
        }

        const progressCallback = (progress: SimulationProgress) => {
          sendEvent(progress, "progress")
        }

        const simulator = new QueueSimulator(params, progressCallback)
        const results = await simulator.simulate()

        // Update simulation run with results
        await supabase
          .from("simulation_runs")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            total_customers: results.totalCustomers,
            avg_wait_time: results.avgWaitTime,
            avg_queue_length: results.avgQueueLength,
            max_queue_length: results.maxQueueLength,
            server_utilization: results.serverUtilization,
          })
          .eq("id", simulationRun.id)

        // Store queue events in batches
        if (results.events.length > 0) {
          const eventRecords = results.events.map((event) => ({
            simulation_run_id: simulationRun.id,
            customer_id: event.customerId,
            event_type: event.eventType,
            event_time: event.eventTime,
            server_id: event.serverId,
            queue_length: event.queueLength,
            wait_time: event.waitTime,
            service_time: event.serviceTime,
          }))

          const batchSize = 1000
          for (let i = 0; i < eventRecords.length; i += batchSize) {
            const batch = eventRecords.slice(i, i + batchSize)
            await supabase.from("queue_events").insert(batch)
          }
        }

        sendEvent(
          {
            simulationId: simulationRun.id,
            results: {
              totalCustomers: results.totalCustomers,
              avgWaitTime: results.avgWaitTime,
              avgQueueLength: results.avgQueueLength,
              maxQueueLength: results.maxQueueLength,
              serverUtilization: results.serverUtilization,
            },
            events: results.events,
          },
          "complete",
        )

        console.log("[QBS] Streamed simulation completed:", simulationRun.id)
      } catch (error) {
        console.error("[QBS] Streamed simulation error:", error)
        sendEvent({ error: "Simulation failed" }, "error")
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
