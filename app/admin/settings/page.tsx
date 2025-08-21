"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Database, Shield, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>Global platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Platform data and storage settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>System Statistics</Label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Total Users</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Total Simulations</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>System notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Admin Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for system events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Activity Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of user registrations and activity</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Platform security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Security Status</Label>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span>SSL Encryption</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span>Row Level Security</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span>Authentication</span>
                    <span className="text-green-600 font-medium">JWT Tokens</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}