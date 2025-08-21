"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AnalyticsOverview } from "@/components/admin/analytics-overview"

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalSimulations: number
    completedSimulations: number
    avgWaitTime: number
  }
  chartData: Array<{
    date: string
    simulations: number
  }>
}

function AdminDashboardContent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management console</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        ) : analyticsData ? (
          <AnalyticsOverview data={analyticsData} />
        ) : (
          <div className="text-center text-muted-foreground">No data available</div>
        )}
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
