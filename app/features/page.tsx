import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, BarChart3, Clock, Users, TrendingUp, Zap, Database, Lock } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/landing" className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">SecureBank Analytics</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Queue Analytics Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools to optimize your banking operations with advanced queue simulation and real-time
            analytics.
          </p>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-time Simulation</CardTitle>
              <CardDescription>
                Advanced Poisson arrival and exponential service time modeling for accurate queue predictions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Live queue length tracking</li>
                <li>• Customer wait time analysis</li>
                <li>• Server utilization metrics</li>
                <li>• Peak hour identification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Comprehensive metrics and KPIs to measure and improve customer service efficiency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Average wait times</li>
                <li>• Service level agreements</li>
                <li>• Customer satisfaction scores</li>
                <li>• Operational efficiency reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Multi-Branch Management</CardTitle>
              <CardDescription>
                Centralized dashboard to monitor and manage queue performance across multiple locations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Branch comparison analytics</li>
                <li>• Resource allocation insights</li>
                <li>• Staff scheduling optimization</li>
                <li>• Cross-location reporting</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Predictive Insights</CardTitle>
              <CardDescription>
                AI-powered forecasting to anticipate busy periods and optimize staffing levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Demand forecasting</li>
                <li>• Seasonal trend analysis</li>
                <li>• Capacity planning tools</li>
                <li>• Resource optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>
                Live dashboards with instant alerts and notifications for queue management teams.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Live queue status</li>
                <li>• Automated alerts</li>
                <li>• Mobile notifications</li>
                <li>• Emergency escalation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Database className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Advanced Reporting</CardTitle>
              <CardDescription>
                Comprehensive reports and data exports for compliance and strategic decision making.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Custom report builder</li>
                <li>• Automated scheduling</li>
                <li>• Data export options</li>
                <li>• Compliance reporting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <Card className="shadow-2xl bg-primary text-primary-foreground mb-16">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Lock className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-4">Enterprise-Grade Security</h2>
            <p className="text-center text-lg mb-8 opacity-90">
              Your data is protected with bank-level security standards and compliance certifications.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold mb-2">256-bit SSL Encryption</h3>
                <p className="text-sm opacity-80">End-to-end data protection</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">SOC 2 Compliant</h3>
                <p className="text-sm opacity-80">Audited security controls</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">GDPR Ready</h3>
                <p className="text-sm opacity-80">Privacy regulation compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Optimize Your Queues?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start analyzing your queue performance today with our comprehensive analytics platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">Get Started Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
