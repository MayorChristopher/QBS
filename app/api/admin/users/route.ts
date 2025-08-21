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
    const offset = (page - 1) * limit

    // Get users without simulation counts for now
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (usersError) {
      console.error("[QBS] Error fetching users:", usersError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Get total count
    const { count, error: countError } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("[QBS] Error counting users:", countError)
    }

    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[QBS] Admin users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    // Update user role
    const { error: updateError } = await supabase.from("profiles").update({ role }).eq("id", userId)

    if (updateError) {
      console.error("[QBS] Error updating user role:", updateError)
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[QBS] Admin user update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
