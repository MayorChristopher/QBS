"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"

interface QueueEvent {
  customerId: number
  eventType: "arrival" | "service_start" | "service_end" | "departure"
  eventTime: number
  queueLength: number
  waitTime?: number
  serviceTime?: number
}

interface ResultsChartProps {
  events: QueueEvent[]
  title: string
  description: string
}

export function ResultsChart({ events, title, description }: ResultsChartProps) {
  // Process events to create chart data
  const queueLengthData = events
    .filter((event) => event.eventType === "arrival" || event.eventType === "departure")
    .map((event) => ({
      time: Math.round(event.eventTime * 10) / 10,
      queueLength: event.queueLength,
    }))

  const waitTimeData = events
    .filter((event) => event.eventType === "service_start" && event.waitTime !== undefined)
    .map((event) => ({
      customer: event.customerId,
      waitTime: Math.round((event.waitTime || 0) * 100) / 100,
    }))
    .slice(0, 50) // Limit to first 50 customers for readability

  const chartConfig = {
    queueLength: {
      label: "Queue Length",
      color: "hsl(var(--chart-1))",
    },
    waitTime: {
      label: "Wait Time (minutes)",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Queue Length Over Time</CardTitle>
          <CardDescription>Number of customers waiting in queue</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={queueLengthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Time (minutes)", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Queue Length", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="stepAfter" dataKey="queueLength" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Customer Wait Times</CardTitle>
          <CardDescription>Wait time for first 50 customers</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="customer"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Customer ID", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Wait Time (min)", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="waitTime" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
