"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Play } from "lucide-react"

interface SimulationFormProps {
  onSubmit: (params: SimulationParams) => Promise<void>
  isLoading?: boolean
}

interface SimulationParams {
  name: string
  description: string
  arrivalRate: number
  serviceRate: number
  numServers: number
  duration: number
}

export function SimulationForm({ onSubmit, isLoading = false }: SimulationFormProps) {
  const [formData, setFormData] = useState<SimulationParams>({
    name: "",
    description: "",
    arrivalRate: 5.0,
    serviceRate: 6.0,
    numServers: 3,
    duration: 60,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof SimulationParams, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-primary">New Queue Simulation</CardTitle>
        <CardDescription>
          Configure parameters for your bank queue simulation using queueing theory models.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground">
                Simulation Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Peak Hour Analysis"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-card-foreground">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="1440"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                className="bg-input border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the scenario you're modeling..."
              className="bg-input border-border"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="arrivalRate" className="text-card-foreground font-medium">
                  Arrival Rate
                </Label>
                <Input
                  id="arrivalRate"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.arrivalRate}
                  onChange={(e) => handleInputChange("arrivalRate", Number(e.target.value))}
                  className="bg-input border-border"
                  required
                />
                <p className="text-xs text-muted-foreground">customers/minute</p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="serviceRate" className="text-card-foreground font-medium">
                  Service Rate
                </Label>
                <Input
                  id="serviceRate"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.serviceRate}
                  onChange={(e) => handleInputChange("serviceRate", Number(e.target.value))}
                  className="bg-input border-border"
                  required
                />
                <p className="text-xs text-muted-foreground">customers/minute/server</p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="numServers" className="text-card-foreground font-medium">
                  Number of Servers
                </Label>
                <Input
                  id="numServers"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numServers}
                  onChange={(e) => handleInputChange("numServers", Number(e.target.value))}
                  className="bg-input border-border"
                  required
                />
                <p className="text-xs text-muted-foreground">tellers/windows</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
