import { Button } from "@/components/ui/button"
import { Shield, TrendingUp, Users, Clock, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <Image
          src="/bank.png"
          alt="Banking background"
          fill
          className="object-cover object-right"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">SecureBank Analytics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Optimize Your
              <span className="text-accent block">Bank Queues</span>
              With Precision
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Advanced queue simulation and analytics platform designed for banking professionals. Reduce customer wait
              times, optimize staff allocation, and improve operational efficiency with real-time insights and
              predictive modeling.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8 py-4 h-auto"
              >
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent font-semibold text-lg px-8 py-4 h-auto"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">99.9%</div>
                <div className="text-sm text-blue-200">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">500+</div>
                <div className="text-sm text-blue-200">Banking Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-blue-200">Expert Support</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Live Queue Analytics</h3>
                <p className="text-blue-200 text-sm">Real-time performance metrics</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/20 rounded-2xl p-6 text-center border border-white/20">
                  <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">45%</div>
                  <div className="text-sm text-blue-200">Wait Time Reduction</div>
                </div>
                <div className="bg-white/20 rounded-2xl p-6 text-center border border-white/20">
                  <Users className="h-8 w-8 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">2.3M</div>
                  <div className="text-sm text-blue-200">Customers Analyzed</div>
                </div>
                <div className="bg-white/20 rounded-2xl p-6 text-center border border-white/20">
                  <Clock className="h-8 w-8 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">3.2min</div>
                  <div className="text-sm text-blue-200">Average Wait Time</div>
                </div>
                <div className="bg-white/20 rounded-2xl p-6 text-center border border-white/20">
                  <BarChart3 className="h-8 w-8 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">94%</div>
                  <div className="text-sm text-blue-200">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
