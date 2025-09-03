"use client"

import { useState, useEffect } from "react"
import LoginForm from "./LoginForm"
import AccountDashboard from "./AccountDashboard"

// Note: This would typically be handled by middleware or server-side auth
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated (this is a simple demo)
    // In a real app, you'd check for valid JWT token or session
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsAuthenticated(isLoggedIn)
    }

    checkAuth()
  }, [])

  return isAuthenticated
}

export default function AccountPage() {
  const isAuthenticated = useAuth()

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated, otherwise show dashboard
  return isAuthenticated ? <AccountDashboard /> : <LoginForm />
}
