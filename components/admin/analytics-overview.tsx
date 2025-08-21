"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Users, BarChart3, CheckCircle, Clock } from "lucide-react"

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

interface AnalyticsOverviewProps {
  data: AnalyticsData
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const chartConfig = {
    simulations: {
      label: "Simulations",
      color: "hsl(var(--chart-1))",
    },
  }

  const completionRate =
    data.overview.totalSimulations > 0 ? (data.overview.completedSimulations / data.overview.totalSimulations) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Simulations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.overview.totalSimulations}</div>
            <p className="text-xs text-muted-foreground mt-1">All time runs</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{data.overview.completedSimulations} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.overview.avgWaitTime.toFixed(2)}m</div>
            <p className="text-xs text-muted-foreground mt-1">Across all simulations</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Daily Simulation Activity</CardTitle>
          <CardDescription>Number of simulations run per day (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="simulations"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
