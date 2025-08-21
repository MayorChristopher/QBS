"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, User, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UserData {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  created_at: string
  simulation_runs: Array<{ count: number }>
}

interface UsersTableProps {
  users: UserData[]
  onRoleChange: (userId: string, newRole: "user" | "admin") => Promise<void>
}

export function UsersTable({ users, onRoleChange }: UsersTableProps) {
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set())

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    setUpdatingUsers((prev) => new Set(prev).add(userId))
    try {
      await onRoleChange(userId, newRole)
    } finally {
      setUpdatingUsers((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-primary">User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Simulations</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-card-foreground">{user.full_name || "Unnamed User"}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-card-foreground">{user.simulation_runs?.[0]?.count || 0}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={updatingUsers.has(user.id)}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, user.role === "admin" ? "user" : "admin")}
                        disabled={updatingUsers.has(user.id)}
                      >
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
