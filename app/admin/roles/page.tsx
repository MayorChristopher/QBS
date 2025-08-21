import { RoleManagement } from "@/components/admin/role-management"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { BackButton } from "@/components/ui/back-button"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function RolesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <BackButton />
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Role Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions across the platform</p>
          </div>

          <RoleManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}
