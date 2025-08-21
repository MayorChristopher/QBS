import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication and admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const offset = (page - 1) * limit

    // Build query without join for now
    let query = supabase
      .from("simulation_runs")
      .select("*")
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }
    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: simulations, error: simError } = await query.range(offset, offset + limit - 1)

    if (simError) {
      console.error("[QBS] Error fetching admin simulations:", simError)
      return NextResponse.json({ error: "Failed to fetch simulations" }, { status: 500 })
    }

    // Get total count
    let countQuery = supabase.from("simulation_runs").select("*", { count: "exact", head: true })
    if (status) countQuery = countQuery.eq("status", status)
    if (userId) countQuery = countQuery.eq("user_id", userId)

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error("[QBS] Error counting admin simulations:", countError)
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
    console.error("[QBS] Admin simulations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
