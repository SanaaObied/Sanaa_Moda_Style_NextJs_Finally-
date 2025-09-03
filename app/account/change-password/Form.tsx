"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"

export default function Form() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear message when user starts typing
    if (message.text) setMessage({ type: "", text: "" })
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    }
  }

  const passwordValidation = validatePassword(formData.newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    // Validation
    if (!passwordValidation.isValid) {
      setMessage({
        type: "error",
        text: "Please ensure your new password meets all requirements.",
      })
      setIsLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match.",
      })
      setIsLoading(false)
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password.",
      })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/changepassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Password changed successfully! You can now use your new password.",
        })
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        })
      } else {
        const errorData = await res.json()
        setMessage({
          type: "error",
          text: errorData.message || "Password change failed. Please try again.",
        })
      }
    } catch (err) {
      console.error("Error:", err)
      setMessage({
        type: "error",
        text: "An error occurred. Please check your connection and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Change Your Password</CardTitle>
            <p className="text-gray-600 mt-2">Keep your account secure with a strong password</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {message.text && (
              <Alert
                className={`${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="pr-10 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pr-10 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      {[
                        { key: "minLength", text: "At least 8 characters" },
                        { key: "hasUpperCase", text: "One uppercase letter" },
                        { key: "hasLowerCase", text: "One lowercase letter" },
                        { key: "hasNumbers", text: "One number" },
                        { key: "hasSpecialChar", text: "One special character" },
                      ].map(({ key, text }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              passwordValidation[key as keyof typeof passwordValidation]
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              passwordValidation[key as keyof typeof passwordValidation]
                                ? "text-green-700"
                                : "text-gray-500"
                            }`}
                          >
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    required
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={`pr-10 border-gray-300 focus:border-rose-500 focus:ring-rose-500 ${
                      formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  isLoading || !passwordValidation.isValid || formData.newPassword !== formData.confirmNewPassword
                }
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing Password...
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Make sure to use a strong, unique password to keep your account secure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
