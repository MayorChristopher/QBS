"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Clock } from "lucide-react"

interface Simulation {
  id: string
  name: string
  user_id: string
  total_customers: number
  avg_wait_time: number
  server_utilization: number
  created_at: string
}

export default function AdminSimulationsPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSimulations = async () => {
      const { data } = await supabase
        .from("simulation_runs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) {
        setSimulations(data)
      }
      setIsLoading(false)
    }

    fetchSimulations()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Simulations</h1>
          <p className="text-muted-foreground">Monitor all user simulation runs across the platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Simulations
            </CardTitle>
            <CardDescription>Latest simulation runs from all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {simulations.map((sim) => (
                <div key={sim.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{sim.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      User ID: {sim.user_id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sim.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {sim.total_customers}
                      </div>
                      <p className="text-xs text-muted-foreground">customers</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {sim.avg_wait_time.toFixed(1)}m
                      </div>
                      <p className="text-xs text-muted-foreground">avg wait</p>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline">
                        {(sim.server_utilization * 100).toFixed(0)}%
                      </Badge>
                      <p className="text-xs text-muted-foreground">utilization</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}