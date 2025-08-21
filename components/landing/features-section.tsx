import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Zap, Shield, Users, Clock, TrendingUp } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor queue performance with live dashboards and comprehensive reporting tools.",
  },
  {
    icon: Zap,
    title: "Advanced Simulation",
    description: "Poisson arrival models and exponential service times for accurate queue predictions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with role-based access control and data encryption.",
  },
  {
    icon: Users,
    title: "Multi-User Management",
    description: "Collaborative workspace with admin controls and user permission management.",
  },
  {
    icon: Clock,
    title: "Optimization Tools",
    description: "Reduce customer wait times and optimize staff allocation automatically.",
  },
  {
    icon: TrendingUp,
    title: "Performance Insights",
    description: "Detailed analytics on server utilization, peak hours, and efficiency metrics.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Banking</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to optimize your queue management and deliver exceptional customer experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
