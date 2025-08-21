import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  // Get role statistics
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("role")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Count roles
  const roleCounts = profiles?.reduce((acc: Record<string, number>, profile) => {
    acc[profile.role || 'user'] = (acc[profile.role || 'user'] || 0) + 1
    return acc
  }, {}) || {}

  const roles = [
    { name: 'user', count: roleCounts.user || 0, description: 'Standard user access' },
    { name: 'admin', count: roleCounts.admin || 0, description: 'Full administrative access' }
  ]

  return NextResponse.json({ roles })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  const { userId, newRole } = await request.json()

  if (!userId || !newRole || !["user", "manager", "admin"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Update user role
  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
