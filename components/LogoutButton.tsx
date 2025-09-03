"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function LogoutButton({ variant = "outline", size = "default", className = "" }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        sessionStorage.clear()

        // Redirect to logout page
        router.push("/logout")
      } else {
        console.error("Logout failed")
        // Still redirect to logout page even if API fails
        router.push("/logout")
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect to logout page even if there's an error
      router.push("/logout")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${className} ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  )
}
