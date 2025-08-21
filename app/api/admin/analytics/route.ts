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

    // Get analytics data
    const [totalUsers, totalSimulations, completedSimulations, avgWaitTime] = await Promise.all([
      // Total users
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),
      // Total simulations
      supabase
        .from("simulation_runs")
        .select("*", { count: "exact", head: true }),
      // Completed simulations
      supabase
        .from("simulation_runs")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
      // Average wait time across all completed simulations
      supabase
        .from("simulation_runs")
        .select("avg_wait_time")
        .eq("status", "completed")
        .not("avg_wait_time", "is", null),
    ])

    // Calculate average wait time
    const avgWait =
      avgWaitTime.data && avgWaitTime.data.length > 0
        ? avgWaitTime.data.reduce((sum, sim) => sum + (sim.avg_wait_time || 0), 0) / avgWaitTime.data.length
        : 0

    // Get simulations by day for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: dailySimulations, error: dailyError } = await supabase
      .from("simulation_runs")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    if (dailyError) {
      console.error("[QBS] Error fetching daily simulations:", dailyError)
    }

    // Process daily data
    const dailyData: { [key: string]: number } = {}
    if (dailySimulations) {
      dailySimulations.forEach((sim) => {
        const date = new Date(sim.created_at).toISOString().split("T")[0]
        dailyData[date] = (dailyData[date] || 0) + 1
      })
    }

    const chartData = Object.entries(dailyData).map(([date, count]) => ({
      date,
      simulations: count,
    }))

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers.count || 0,
        totalSimulations: totalSimulations.count || 0,
        completedSimulations: completedSimulations.count || 0,
        avgWaitTime: avgWait,
      },
      chartData,
    })
  } catch (error) {
    console.error("[QBS] Admin analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
