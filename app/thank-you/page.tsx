"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, ArrowRight, Home, MessageSquare, Phone } from "lucide-react"

export default function ThankYouPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(8)

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

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your message has been successfully sent. We appreciate you reaching out to us!
          </p>

          {/* What's Next */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">Check your inbox for a confirmation email with your ticket number</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">We'll respond to your inquiry within 24 hours</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Stay Connected</h3>
              <p className="text-sm text-gray-600">Follow up via email or WhatsApp for urgent matters</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg p-6 mb-8">
            <p className="text-gray-700 mb-2">Redirecting to homepage in:</p>
            <div className="text-4xl font-bold text-rose-600 mb-2">{countdown}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((8 - countdown) / 8) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Homepage
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open("https://wa.me/972592845459", "_blank")}
              className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp Support
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              💌 Your ticket number will be included in the confirmation email for easy reference.
            </p>
            <p className="text-xs text-gray-500">
              For urgent matters, call us at{" "}
              <a href="tel:+972592845459" className="text-rose-600 hover:underline">
                +972-592-845-459
              </a>{" "}
              or message us on WhatsApp.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
