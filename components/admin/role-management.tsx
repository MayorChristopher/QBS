"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Shield, UserCheck } from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  created_at: string
}

interface Role {
  name: string
  count: number
  description: string
}

export function RoleManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch role statistics
      const rolesResponse = await fetch("/api/admin/roles")
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json()
        setRoles(rolesData.roles)
      }

      // Fetch users for role management
      const usersResponse = await fetch("/api/admin/users")
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId: string, newRole: string) => {
    setUpdating(userId)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole as any } : user)))
        // Refresh role statistics
        fetchData()
      }
    } catch (error) {
      console.error("Failed to update role:", error)
    } finally {
      setUpdating(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <div key={role.name} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getRoleIcon(role.name)}
                  <h3 className="font-medium capitalize">{role.name}</h3>
                </div>
                <p className="text-2xl font-bold">{role.count}</p>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{user.full_name || "No name"}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </Badge>

                  <Select
                    value={user.role}
                    onValueChange={(newRole) => updateRole(user.id, newRole)}
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
