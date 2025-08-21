"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { UsersTable } from "@/components/admin/users-table"

interface UserData {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  created_at: string
  simulation_runs: Array<{ count: number }>
}

function AdminUsersContent() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      // Update local state
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading users...</div>
          </div>
        ) : (
          <UsersTable users={users} onRoleChange={handleRoleChange} />
        )}
      </main>
    </div>
  )
}

export default function AdminUsers() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminUsersContent />
    </ProtectedRoute>
  )
}
