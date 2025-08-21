"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">SecureBank</h1>
          <p className="text-lg text-muted-foreground">Queue Analytics Platform</p>
          <h2 className="text-xl font-semibold text-card-foreground mt-4">Welcome back</h2>
          <p className="text-muted-foreground">Access your secure banking analytics dashboard</p>
        </div>

        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-primary text-center">Secure Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@securebank.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input border-border h-11"
                />
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In Securely"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground mb-2">New to SecureBank?</p>
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 hover:underline font-medium">
                Create Account
              </Link>
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>🔒 Your connection is secured with 256-bit SSL encryption</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
