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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (!signUpData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-primary rounded-full">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">SecureBank</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Queue Analytics Platform</p>
          <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mt-4">Join SecureBank</h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Create your account for professional queue analytics
          </p>
        </div>

        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="pb-4 px-4 sm:px-6">
            <CardTitle className="text-primary text-center text-lg sm:text-xl">Create Account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Join thousands of banking professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-card-foreground font-medium text-sm sm:text-base">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-input border-border h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground font-medium text-sm sm:text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground font-medium text-sm sm:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input border-border h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-card-foreground font-medium text-sm sm:text-base">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-input border-border h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{error}</span>
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 sm:h-11 font-medium text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm sm:text-base">Creating Account...</span>
                  </>
                ) : (
                  "Create Account & Sign In"
                )}
              </Button>
            </form>
            <div className="mt-4 sm:mt-6 text-center text-sm">
              <p className="text-muted-foreground mb-2">Already have an account?</p>
              <Link href="/auth/login" className="text-secondary hover:underline font-medium">
                Sign In
              </Link>
            </div>
            <div className="mt-3 sm:mt-4 text-xs text-muted-foreground text-center space-y-1">
              <p>🔒 Bank-grade security with 256-bit SSL encryption</p>
              <p>✓ Instant access - no email verification required</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
