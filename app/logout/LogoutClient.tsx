"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, LogOut, Home, ArrowRight } from "lucide-react"

export default function LogoutClient() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Simulate logout process
    const logoutTimer = setTimeout(() => {
      setIsLoggingOut(false)
      setIsComplete(true)
    }, 1500)

    return () => clearTimeout(logoutTimer)
  }, [])

  useEffect(() => {
    if (isComplete && countdown > 0) {
      const countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(countdownTimer)
    } else if (isComplete && countdown === 0) {
      router.push("/")
    }
  }, [isComplete, countdown, router])

  const handleGoHomeNow = () => {
    router.push("/")
  }

  const handleStayLoggedOut = () => {
    // Clear any remaining session data
    localStorage.removeItem("user")
    sessionStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {isLoggingOut ? (
            // Logging out animation
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <LogOut className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Logging Out...</h1>
                <p className="text-gray-600">Please wait while we securely log you out</p>
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
              </div>
            </div>
          ) : (
            // Logout complete
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Successfully Logged Out!</h1>
                <p className="text-gray-600 mb-4">
                  Thank you for visiting Sonaa Moda Style. We hope to see you again soon!
                </p>
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
                  <p className="text-rose-800 text-sm">
                    🛡️ Your session has been securely terminated and all data cleared.
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg p-4">
                <p className="text-gray-700 mb-2">Redirecting to homepage in:</p>
                <div className="text-3xl font-bold text-rose-600 mb-2">{countdown}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoHomeNow}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleStayLoggedOut}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Stay on This Page
                </Button>
              </div>

              {/* Quick Links */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-3">Quick Links:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => router.push("/registration")}
                    className="text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                  >
                    Sign In Again
                  </button>
                  <button
                    onClick={() => router.push("/dresses")}
                    className="text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                  >
                    Browse Dresses
                  </button>
                  <button
                    onClick={() => router.push("/contact")}
                    className="text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-100">
                <p className="text-sm text-gray-700">
                  💖 Thank you for choosing Sonaa Moda Style for your fashion needs!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
