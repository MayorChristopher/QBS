"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/dashboard/header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Play, BarChart3, Settings, Users, Clock, TrendingUp, AlertCircle } from "lucide-react"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
}

export default function HelpPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Guide</h1>
          <p className="text-muted-foreground">Complete guide to using SecureBank Queue Analytics Platform</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  What is SecureBank Queue Analytics?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>A professional banking queue simulation platform that helps optimize customer service operations using mathematical queueing theory.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Problems We Solve:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Long customer wait times</li>
                      <li>• Inefficient staff scheduling</li>
                      <li>• Poor resource allocation</li>
                      <li>• Operational cost optimization</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Benefits:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Reduce customer wait times by up to 45%</li>
                      <li>• Optimize teller staffing levels</li>
                      <li>• Improve customer satisfaction</li>
                      <li>• Data-driven decision making</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-2">1. Configure</h4>
                    <p className="text-sm text-muted-foreground">Set arrival rates, service rates, and number of tellers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-2">2. Simulate</h4>
                    <p className="text-sm text-muted-foreground">Run mathematical queue models using queueing theory</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-2">3. Analyze</h4>
                    <p className="text-sm text-muted-foreground">Review results and optimize operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Running Simulations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Simulation Parameters:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Badge variant="outline">Arrival Rate</Badge>
                        <p className="text-sm text-muted-foreground">Number of customers arriving per minute (e.g., 5.0 = 5 customers/minute)</p>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline">Service Rate</Badge>
                        <p className="text-sm text-muted-foreground">Customers served per minute per teller (e.g., 6.0 = 6 customers/minute/teller)</p>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline">Number of Servers</Badge>
                        <p className="text-sm text-muted-foreground">Total teller windows available (e.g., 3 tellers)</p>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline">Duration</Badge>
                        <p className="text-sm text-muted-foreground">Simulation time in minutes (e.g., 60 minutes = 1 hour)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Example Scenarios:
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Peak Hours:</strong> Arrival Rate: 8, Service Rate: 5, Servers: 4</p>
                      <p><strong>Normal Hours:</strong> Arrival Rate: 3, Service Rate: 6, Servers: 2</p>
                      <p><strong>Off-Peak:</strong> Arrival Rate: 1, Service Rate: 6, Servers: 1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Understanding Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Average Wait Time</h4>
                    <p className="text-sm text-muted-foreground">How long customers wait in queue before being served</p>
                  </div>
                  <div className="space-y-2">
                    <Users className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Customers Served</h4>
                    <p className="text-sm text-muted-foreground">Total number of customers processed during simulation</p>
                  </div>
                  <div className="space-y-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Server Utilization</h4>
                    <p className="text-sm text-muted-foreground">Percentage of time tellers are actively serving customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Dashboard Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Your dashboard displays real-time metrics from your simulation results:</p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Metrics Cards</h4>
                    <p className="text-sm text-muted-foreground">Show data from your most recent simulation with percentage change from previous run</p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Recent Simulations</h4>
                    <p className="text-sm text-muted-foreground">List of your latest simulation runs with key performance indicators</p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Trend Analysis</h4>
                    <p className="text-sm text-muted-foreground">Compare performance across different scenarios to identify optimal configurations</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Optimization Tips:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Target server utilization between 70-85% for optimal efficiency</li>
                    <li>• Keep average wait time under 5 minutes for customer satisfaction</li>
                    <li>• Run multiple scenarios to find the best staff allocation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            {profile?.role === "admin" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Administrator Functions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">User Management</h4>
                      <p className="text-sm text-muted-foreground mb-2">Access the admin panel to:</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• View all registered users</li>
                        <li>• Manage user roles and permissions</li>
                        <li>• Monitor system usage</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">System Analytics</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• View platform-wide simulation statistics</li>
                        <li>• Monitor system performance</li>
                        <li>• Generate usage reports</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Data Management</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Export system-wide data</li>
                        <li>• Manage data retention policies</li>
                        <li>• System backup and maintenance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Administrator Access Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">You need administrator privileges to access admin documentation.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}