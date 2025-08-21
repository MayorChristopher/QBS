import { Shield, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">SecureBank Analytics</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Professional queue management and analytics platform trusted by banking institutions worldwide.
            </p>

          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Solutions</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Queue Simulation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Real-time Analytics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Performance Optimization
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Staff Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm text-blue-200">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent" />
                <span>stanleyoffia@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent" />
                <span>08085017786</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span>MOUAU, Abia state</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-blue-200">© 2025 SecureBank Analytics. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-blue-200">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
