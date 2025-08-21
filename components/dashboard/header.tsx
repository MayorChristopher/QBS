"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { User, LogOut, Settings, Shield, BookOpen } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  user?: {
    email?: string
    full_name?: string
    role?: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const { signOut } = useAuth()

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U"

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.replace("/auth/login")
    } catch (error) {
      console.error("Sign out error:", error)
      window.location.replace("/auth/login")
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-primary">Bank Queue Analytics</h2>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === "admin" && (
          <Link href="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Shield className="h-4 w-4" />
              Admin Panel
            </Button>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                {user?.role === "admin" && (
                  <p className="text-xs leading-none text-secondary font-medium">Administrator</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Help & Guide</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
