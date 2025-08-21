import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Get user's simulation runs
    const { data: simulations, error: simError } = await supabase
      .from("simulation_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (simError) {
      console.error("[QBS] Error fetching simulations:", simError)
      return NextResponse.json({ error: "Failed to fetch simulations" }, { status: 500 })
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("simulation_runs")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("[QBS] Error counting simulations:", countError)
    }

    return NextResponse.json({
      simulations: simulations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[QBS] Error fetching simulation list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
