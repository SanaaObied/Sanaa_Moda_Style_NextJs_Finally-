import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"
import Image from "next/image"
import EnhancedNavbar from "@/components/EnhancedNavbar"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "Sonaa Moda Style - Elegant Fashion Store",
  description:
    "Discover elegant fashion for everyone at Sonaa Moda Style. Premium clothing and accessories in Ramallah.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-white">
        {/* Hero Header with banner - only show on homepage */}
        <header className="relative">
          <div className="relative h-96 overflow-hidden">
            <Image
              src="/images/banner.jpg"
              width={1920}
              height={800}
              alt="Sonaa Moda Style - Fashion Collection"
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide drop-shadow-lg">Sonaa Moda Style</h1>
                <p className="text-xl md:text-2xl font-light tracking-wider drop-shadow-md">
                  Elegant Fashion • Premium Quality • Timeless Style
                </p>
              </div>
            </div>
          </div>
          <EnhancedNavbar />
        </header>

        <main>{children}</main>

        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Store Info */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Store Information</h3>
                <p className="mb-2">📍 Abu-Falah, Ramallah</p>
                <p className="mb-2">📞 +972-592845459</p>
                <p className="mb-2">✉️ sonaamodastyle@gmail.com</p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/dresses" className="hover:text-rose-300 transition-colors">
                      Dresses
                    </Link>
                  </li>
                  <li>
                    <Link href="/tops" className="hover:text-rose-300 transition-colors">
                      Tops
                    </Link>
                  </li>
                  <li>
                    <Link href="/new-arrivals" className="hover:text-rose-300 transition-colors">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/sale" className="hover:text-rose-300 transition-colors">
                      Sale Items
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Customer Service</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/contact" className="hover:text-rose-300 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-rose-300 transition-colors">
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/return_policy" className="hover:text-rose-300 transition-colors">
                      Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/registration" className="hover:text-rose-300 transition-colors">
                      Registration
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Follow Us</h3>
                <p className="mb-4">Stay updated with our latest collections and fashion trends.</p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center hover:bg-rose-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center hover:bg-rose-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">@</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-400 mb-2">Last Update: March 30, 2024</p>
                  <p>&copy; 2024 Sonaa Moda Style. All rights reserved.</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link href="/privacy_policy" className="text-gray-400 hover:text-rose-300 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms_conditions" className="text-gray-400 hover:text-rose-300 transition-colors">
                    Terms & Conditions
                  </Link>
                  <Link href="/return_policy" className="text-gray-400 hover:text-rose-300 transition-colors">
                    Return Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#333",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  )
}
