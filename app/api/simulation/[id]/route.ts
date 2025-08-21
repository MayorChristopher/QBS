import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const simulationId = params.id

    // Get simulation run details
    const { data: simulation, error: simError } = await supabase
      .from("simulation_runs")
      .select("*")
      .eq("id", simulationId)
      .single()

    if (simError || !simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    // Get queue events for this simulation
    const { data: events, error: eventsError } = await supabase
      .from("queue_events")
      .select("*")
      .eq("simulation_run_id", simulationId)
      .order("event_time", { ascending: true })

    if (eventsError) {
      console.error("[QBS] Error fetching queue events:", eventsError)
      return NextResponse.json({ error: "Failed to fetch simulation events" }, { status: 500 })
    }

    return NextResponse.json({
      simulation,
      events: events || [],
    })
  } catch (error) {
    console.error("[QBS] Error fetching simulation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const simulationId = params.id

    // Delete simulation run (cascade will delete related events)
    const { error: deleteError } = await supabase.from("simulation_runs").delete().eq("id", simulationId)

    if (deleteError) {
      console.error("[QBS] Error deleting simulation:", deleteError)
      return NextResponse.json({ error: "Failed to delete simulation" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[QBS] Error deleting simulation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
