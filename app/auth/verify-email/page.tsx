"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/landing")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SecureBank Queue</h1>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-primary">Account Ready!</CardTitle>
            <CardDescription>
              Your account has been created successfully. Email verification is not required.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Redirecting you to the homepage in 3 seconds...</p>
            <Link href="/landing">
              <Button className="w-full">Continue to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
