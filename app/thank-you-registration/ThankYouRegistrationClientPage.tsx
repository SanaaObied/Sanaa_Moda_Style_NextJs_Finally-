"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Gift, ArrowRight, Home, User, Star, Crown, Sparkles } from "lucide-react"

export default function ThankYouRegistrationClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)
  const [showFireworks, setShowFireworks] = useState(true)

  // Get user data from URL params if available
  const userName = searchParams.get("name") || "Fashion Lover"
  const userEmail = searchParams.get("email") || ""

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

    // Hide fireworks after 4 seconds
    const fireworksTimer = setTimeout(() => {
      setShowFireworks(false)
    }, 4000)

    return () => {
      clearInterval(timer)
      clearTimeout(fireworksTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-rose-200 to-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-10 left-20 w-28 h-28 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-20 animate-bounce delay-500"></div>
      </div>

      {/* Fireworks Effect */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${
                i % 5 === 0
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                  : i % 5 === 1
                    ? "bg-gradient-to-r from-purple-400 to-pink-500"
                    : i % 5 === 2
                      ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                      : i % 5 === 3
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-rose-400 to-pink-500"
              } animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardContent className="p-12 text-center">
          {/* Success Icon with Crown */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <Crown className="absolute -top-4 left-1/2 transform -translate-x-1/2 h-8 w-8 text-yellow-500 animate-pulse" />
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Sonaa Moda Style! 👑</h1>
            <p className="text-2xl text-gray-600 mb-2">
              Hello <span className="font-bold text-purple-600">{userName}</span>!
            </p>
            <p className="text-lg text-gray-500">
              Your fashion journey begins now. Thank you for joining our exclusive community!
            </p>
          </div>

          {/* VIP Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-4">
                <Mail className="h-12 w-12 text-purple-600 mx-auto" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Email Verification</h3>
              <p className="text-sm text-gray-600">Check your inbox for verification instructions and welcome bonus</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-4">
                <Gift className="h-12 w-12 text-rose-600 mx-auto" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Welcome Gift</h3>
              <p className="text-sm text-gray-600">
                Enjoy 20% off your first purchase with code <span className="font-bold text-rose-600">WELCOME20</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-4">
                <User className="h-12 w-12 text-blue-600 mx-auto" />
                <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">VIP Access</h3>
              <p className="text-sm text-gray-600">
                Early access to new collections, exclusive deals, and fashion events
              </p>
            </div>
          </div>

          {/* Exclusive Perks */}
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🎉 Your VIP Perks Activated!</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-gray-700">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-gray-700">Birthday month special discount</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-gray-700">Priority customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-gray-700">Exclusive fashion tips & styling advice</span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
            <p className="text-gray-700 mb-2">Taking you to your account dashboard in:</p>
            <div className="text-5xl font-bold text-purple-600 mb-3">{countdown}</div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-4 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => router.push("/account")}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <User className="h-5 w-5 mr-2" />
              Explore My Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              <Home className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              💌 A welcome email with your verification link and exclusive offers has been sent to{" "}
              <span className="font-semibold text-purple-600">{userEmail}</span>
            </p>
            <p className="text-xs text-gray-500">
              Need help getting started? Contact our VIP support team at{" "}
              <a href="mailto:vip@sonaamodastyle.com" className="text-purple-600 hover:underline font-medium">
                vip@sonaamodastyle.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
