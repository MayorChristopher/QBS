import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">SecureBank Analytics</span>
              <span className="sm:hidden">SecureBank</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-700 hover:text-primary font-medium">
              Features
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm" className="text-sm sm:text-base">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="text-sm sm:text-base">
              <Link href="/auth/signup">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
