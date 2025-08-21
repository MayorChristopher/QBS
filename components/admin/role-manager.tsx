"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

interface RoleManagerProps {
  profiles: Profile[]
  onRoleUpdate: () => void
}

export function RoleManager({ profiles, onRoleUpdate }: RoleManagerProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(userId)
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      toast.success("Role updated successfully")
      onRoleUpdate()
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Failed to update role")
    } finally {
      setUpdating(null)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{profile.full_name || profile.email}</div>
                <div className="text-sm text-gray-500">{profile.email}</div>
                <Badge variant={getRoleBadgeVariant(profile.role)} className="mt-1">
                  {profile.role}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Select
                  value={profile.role}
                  onValueChange={(newRole) => updateUserRole(profile.id, newRole)}
                  disabled={updating === profile.id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
