"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Gift, ArrowRight, Home, User } from "lucide-react"

export default function ThankRegisterPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/account")
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Sonaa Moda Style!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for joining our fashion community. Your account has been successfully created!
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-rose-50 rounded-lg p-6">
              <Mail className="h-8 w-8 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Email Verification</h3>
              <p className="text-sm text-gray-600">Check your email for verification instructions</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <Gift className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Welcome Offer</h3>
              <p className="text-sm text-gray-600">Enjoy 15% off your first purchase with code WELCOME15</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">VIP Access</h3>
              <p className="text-sm text-gray-600">Get early access to new collections and exclusive deals</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg p-6 mb-8">
            <p className="text-gray-700 mb-2">Redirecting to your account in:</p>
            <div className="text-4xl font-bold text-rose-600 mb-2">{countdown}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/account")}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              <User className="h-4 w-4 mr-2" />
              Go to My Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              💌 A confirmation email has been sent to your email address. Please verify your account to unlock all
              features.
            </p>
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@sonaamodastyle.com" className="text-rose-600 hover:underline">
                support@sonaamodastyle.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
