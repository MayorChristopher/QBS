import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { QueueSimulator, type SimulationParams } from "@/lib/simulation/queue-simulator"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, arrivalRate, serviceRate, numServers, duration } = body

    // Validate input parameters
    if (!name || !arrivalRate || !serviceRate || !numServers || !duration) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (arrivalRate <= 0 || serviceRate <= 0 || numServers <= 0 || duration <= 0) {
      return NextResponse.json({ error: "All parameters must be positive" }, { status: 400 })
    }

    if (numServers > 20) {
      return NextResponse.json({ error: "Maximum 20 servers allowed" }, { status: 400 })
    }

    if (duration > 1440) {
      return NextResponse.json({ error: "Maximum simulation duration is 24 hours (1440 minutes)" }, { status: 400 })
    }

    console.log("[QBS] Starting new simulation for user:", user.id)

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
      console.error("[QBS] Error creating simulation run:", insertError)
      return NextResponse.json({ error: "Failed to create simulation run" }, { status: 500 })
    }

    // Run the simulation
    const params: SimulationParams = {
      arrivalRate,
      serviceRate,
      numServers,
      duration,
    }

    const simulator = new QueueSimulator(params)
    const results = await simulator.simulate()

    // Update simulation run with results
    const { error: updateError } = await supabase
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

    if (updateError) {
      console.error("[QBS] Error updating simulation run:", updateError)
    }

    // Store queue events (batch insert for better performance)
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

      // Insert events in batches of 1000 to avoid payload limits
      const batchSize = 1000
      for (let i = 0; i < eventRecords.length; i += batchSize) {
        const batch = eventRecords.slice(i, i + batchSize)
        const { error: eventsError } = await supabase.from("queue_events").insert(batch)

        if (eventsError) {
          console.error("[QBS] Error inserting queue events batch:", eventsError)
        }
      }
    }

    console.log("[QBS] Simulation completed successfully:", simulationRun.id)

    return NextResponse.json({
      simulationId: simulationRun.id,
      results: {
        totalCustomers: results.totalCustomers,
        avgWaitTime: results.avgWaitTime,
        avgQueueLength: results.avgQueueLength,
        maxQueueLength: results.maxQueueLength,
        serverUtilization: results.serverUtilization,
      },
    })
  } catch (error) {
    console.error("[QBS] Simulation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
