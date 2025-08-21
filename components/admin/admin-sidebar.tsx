"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Settings, Menu, X, Shield, Activity, UserCheck } from "lucide-react"

const navigation = [
  { name: "Overview", href: "/admin", icon: Activity },
  { name: "Simulations", href: "/admin/simulations", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Roles", href: "/admin/roles", icon: UserCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-sidebar-accent" />
            <h1 className="text-lg font-bold text-sidebar-foreground">Admin Panel</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/10"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                  !isActive && "hover:bg-sidebar-accent/10",
                  isCollapsed && "px-2",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Back to Dashboard */}
      <div className="p-4 border-t border-sidebar-border">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" size="sm">
            <BarChart3 className="h-4 w-4" />
            {!isCollapsed && <span>User Dashboard</span>}
          </Button>
        </Link>
      </div>
    </div>
  )
}
