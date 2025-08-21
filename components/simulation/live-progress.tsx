"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, TrendingUp, Server, Activity } from "lucide-react"

interface SimulationProgress {
  currentTime: number
  totalDuration: number
  customersProcessed: number
  currentQueueLength: number
  avgWaitTime: number
  serverUtilization: number
  status: "running" | "completed" | "error"
}

interface LiveProgressProps {
  progress: SimulationProgress | null
  isActive: boolean
}

export function LiveProgress({ progress, isActive }: LiveProgressProps) {
  if (!progress && !isActive) return null

  const progressPercentage = progress ? (progress.currentTime / progress.totalDuration) * 100 : 0

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "running":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case "running":
        return "Running"
      case "completed":
        return "Completed"
      case "error":
        return "Error"
      default:
        return "Initializing"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Simulation Progress
          </CardTitle>
          <Badge className={getStatusColor(progress?.status)}>{getStatusText(progress?.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-card-foreground">
              {progress ? `${progress.currentTime.toFixed(1)}/${progress.totalDuration} minutes` : "0/0 minutes"}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-center text-sm text-muted-foreground">{progressPercentage.toFixed(1)}% Complete</div>
        </div>

        {progress && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Users className="h-4 w-4 text-chart-1" />
              <div>
                <div className="text-sm font-medium text-card-foreground">{progress.customersProcessed}</div>
                <div className="text-xs text-muted-foreground">Processed</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <TrendingUp className="h-4 w-4 text-chart-2" />
              <div>
                <div className="text-sm font-medium text-card-foreground">{progress.currentQueueLength}</div>
                <div className="text-xs text-muted-foreground">In Queue</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Clock className="h-4 w-4 text-chart-3" />
              <div>
                <div className="text-sm font-medium text-card-foreground">{progress.avgWaitTime.toFixed(2)}m</div>
                <div className="text-xs text-muted-foreground">Avg Wait</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Server className="h-4 w-4 text-chart-4" />
              <div>
                <div className="text-sm font-medium text-card-foreground">
                  {(progress.serverUtilization * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Utilization</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
