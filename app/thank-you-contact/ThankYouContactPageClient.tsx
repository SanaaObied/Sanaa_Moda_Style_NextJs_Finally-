"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, ArrowRight, Home, MessageSquare, Phone, Star, Heart } from "lucide-react"

export default function ThankYouContactPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(8)
  const [showConfetti, setShowConfetti] = useState(true)

  // Get form data from URL params if available
  const customerName = searchParams.get("name") || "Valued Customer"
  const inquiryType = searchParams.get("type") || "general inquiry"

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(confettiTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-rose-300 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${
                i % 4 === 0
                  ? "from-rose-400 to-pink-400"
                  : i % 4 === 1
                    ? "from-purple-400 to-indigo-400"
                    : i % 4 === 2
                      ? "from-yellow-400 to-orange-400"
                      : "from-green-400 to-emerald-400"
              } animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardContent className="p-12 text-center">
          {/* Success Icon with Animation */}
          <div className="mx-auto w-28 h-28 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-lg">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You, {customerName}! 🎉</h1>
          <p className="text-xl text-gray-600 mb-2">Your message has been successfully received!</p>
          <p className="text-lg text-gray-500 mb-8">
            We appreciate you reaching out regarding your{" "}
            <span className="font-semibold text-rose-600">{inquiryType}</span>
          </p>

          {/* What Happens Next */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 transform hover:scale-105 transition-transform">
              <Mail className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">Check your inbox for a confirmation with your ticket number</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 transform hover:scale-105 transition-transform">
              <Clock className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">Our team will respond within 24 hours during business days</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 transform hover:scale-105 transition-transform">
              <MessageSquare className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Stay Connected</h3>
              <p className="text-sm text-gray-600">Follow up via WhatsApp for urgent matters</p>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-6 mb-8">
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 font-medium mb-2">Join 10,000+ Happy Customers</p>
            <p className="text-sm text-gray-600">98% customer satisfaction rate • 4.9/5 average rating</p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-6 mb-8">
            <p className="text-gray-700 mb-2">Redirecting to homepage in:</p>
            <div className="text-4xl font-bold text-rose-600 mb-3">{countdown}</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((8 - countdown) / 8) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open("https://wa.me/972592845459", "_blank")}
              className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp Support
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-rose-500" />
              <p className="text-sm text-gray-600">
                Thank you for choosing Sonaa Moda Style - Where Fashion Meets Elegance
              </p>
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
            <p className="text-xs text-gray-500">
              For urgent matters, call us at{" "}
              <a href="tel:+972592845459" className="text-rose-600 hover:underline font-medium">
                +972-592-845-459
              </a>{" "}
              or visit our store in Ramallah
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
