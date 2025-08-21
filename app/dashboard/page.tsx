"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/dashboard/header"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { SimulationForm } from "@/components/simulation/simulation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Clock, TrendingUp, Play, History } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface SimulationRun {
  id: string
  name: string
  status: string
  created_at: string
  avg_wait_time: number
  total_customers: number
  server_utilization: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentSimulations, setRecentSimulations] = useState<SimulationRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSimulationLoading, setIsSimulationLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      console.log("[QBS] Auth user:", authUser)

      if (authUser) {
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

        console.log("[QBS] Profile data:", profile)
        console.log("[QBS] Profile error:", error)

        if (profile) {
          setUser({
            id: profile.id,
            email: authUser.email || "",
            full_name: profile.full_name || "",
            role: profile.role || "user",
          })
        } else {
          console.log("[QBS] Creating missing profile for user:", authUser.id)
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || "",
              role: "user",
            })
            .select()
            .single()

          console.log("[QBS] New profile created:", newProfile)
          console.log("[QBS] Create error:", createError)

          if (newProfile) {
            setUser({
              id: newProfile.id,
              email: authUser.email || "",
              full_name: newProfile.full_name || "",
              role: newProfile.role || "user",
            })
          }
        }
      }
      setIsLoading(false)
    }

    const getRecentSimulations = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from("simulation_runs")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (data) {
          setRecentSimulations(data)
        }
      }
    }

    getUser()
    getRecentSimulations()
  }, [supabase])

  const handleSimulationSubmit = async (params: {
    name: string
    description: string
    arrivalRate: number
    serviceRate: number
    numServers: number
    duration: number
  }) => {
    setIsSimulationLoading(true)
    try {
      const response = await fetch("/api/simulation/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Failed to run simulation")
      }

      const result = await response.json()
      console.log("[QBS] Simulation completed:", result)

      // Refresh recent simulations
      const getRecentSimulations = async () => {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (authUser) {
          const { data } = await supabase
            .from("simulation_runs")
            .select("*")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false })
            .limit(5)

          if (data) {
            setRecentSimulations(data)
          }
        }
      }

      await getRecentSimulations()
    } catch (error) {
      console.error("[QBS] Simulation error:", error)
      // You could add toast notification here
    } finally {
      setIsSimulationLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.full_name || user.email}</h1>
          <p className="text-muted-foreground">Manage your queue simulations and analyze performance metrics</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Simulations"
            value={recentSimulations.length.toString()}
            icon={BarChart3}
            trend="+12%"
            trendUp={true}
          />
          <MetricsCard 
            title="Avg Wait Time" 
            value={recentSimulations.length > 0 ? `${recentSimulations[0].avg_wait_time.toFixed(1)} min` : "0 min"} 
            icon={Clock} 
            trend={recentSimulations.length > 1 ? `${((recentSimulations[0].avg_wait_time - recentSimulations[1].avg_wait_time) / recentSimulations[1].avg_wait_time * 100).toFixed(0)}%` : "0%"} 
            trendUp={recentSimulations.length > 1 ? recentSimulations[0].avg_wait_time < recentSimulations[1].avg_wait_time : false} 
          />
          <MetricsCard 
            title="Customers Served" 
            value={recentSimulations.length > 0 ? recentSimulations[0].total_customers.toString() : "0"} 
            icon={Users} 
            trend={recentSimulations.length > 1 ? `${((recentSimulations[0].total_customers - recentSimulations[1].total_customers) / recentSimulations[1].total_customers * 100).toFixed(0)}%` : "0%"} 
            trendUp={recentSimulations.length > 1 ? recentSimulations[0].total_customers > recentSimulations[1].total_customers : false} 
          />
          <MetricsCard 
            title="Server Utilization" 
            value={recentSimulations.length > 0 ? `${(recentSimulations[0].server_utilization * 100).toFixed(0)}%` : "0%"} 
            icon={TrendingUp} 
            trend={recentSimulations.length > 1 ? `${(((recentSimulations[0].server_utilization - recentSimulations[1].server_utilization) / recentSimulations[1].server_utilization) * 100).toFixed(0)}%` : "0%"} 
            trendUp={recentSimulations.length > 1 ? recentSimulations[0].server_utilization > recentSimulations[1].server_utilization : false} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Simulation */}
          <div>
            <SimulationForm onSubmit={handleSimulationSubmit} isLoading={isSimulationLoading} />
          </div>

          {/* Recent Simulations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Simulations
              </CardTitle>
              <CardDescription>Your latest simulation runs and results</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSimulations.length > 0 ? (
                <div className="space-y-4">
                  {recentSimulations.map((sim) => (
                    <div key={sim.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{sim.name}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(sim.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{sim.avg_wait_time.toFixed(1)} min avg</p>
                        <p className="text-xs text-muted-foreground">{sim.total_customers} customers</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No simulations yet</p>
                  <p className="text-sm text-muted-foreground">Run your first simulation to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
