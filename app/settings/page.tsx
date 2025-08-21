"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/dashboard/header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Database, Shield, Download, Trash2 } from "lucide-react"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [simulationAlerts, setSimulationAlerts] = useState(true)
  const [dataRetention, setDataRetention] = useState("90")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      }
      setIsLoading(false)
    }
    getProfile()
  }, [supabase])

  const handleExportData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from("simulation_runs")
        .select("*")
        .eq("user_id", user.id)
      
      if (data && data.length > 0) {
        const exportData = {
          exported_at: new Date().toISOString(),
          user_id: user.id,
          total_simulations: data.length,
          simulations: data
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `simulation-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={profile} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your queue analytics platform preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive updates about your simulations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about simulation results</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Simulation Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when simulations complete or fail</p>
                </div>
                <Switch
                  checked={simulationAlerts}
                  onCheckedChange={setSimulationAlerts}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Control how your simulation data is stored and managed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How long to keep your simulation data before automatic deletion
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>Manage your account security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account Security</Label>
                <p className="text-sm text-muted-foreground">
                  Your account is secured with bank-grade encryption. All data is encrypted in transit and at rest.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Data Privacy</Label>
                <p className="text-sm text-muted-foreground">
                  Your simulation data is private and only accessible to you. We never share your data with third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions that affect your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Delete All Simulation Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all your simulation runs and results. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}