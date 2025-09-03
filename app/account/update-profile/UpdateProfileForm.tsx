"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from "lucide-react"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  address: string
  city: string
  postalCode: string
  country: string
  avatar?: string
  dateJoined?: string
  lastUpdated?: string
}

interface ValidationErrors {
  [key: string]: string
}

export default function UpdateProfileForm() {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const [originalData, setOriginalData] = useState<ProfileData>({} as ProfileData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setFormData(data)
          setOriginalData(data)
        } else {
          setMessage({ type: "error", text: "Failed to load profile data" })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setMessage({ type: "error", text: "Error loading profile data" })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Check for changes
  useEffect(() => {
    const changed = Object.keys(formData).some((key) => {
      if (key === "password" || key === "confirmPassword") return false
      return formData[key as keyof ProfileData] !== originalData[key as keyof ProfileData]
    })
    setHasChanges(changed || (formData.password && formData.password.length > 0))
  }, [formData, originalData])

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    // Clear message when user starts typing
    if (message.text) setMessage({ type: "", text: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors below" })
      return
    }

    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setOriginalData(formData)
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }))
        setMessage({
          type: "success",
          text: "Profile updated successfully! Your changes have been saved.",
        })
      } else {
        const errorData = await response.json()
        setMessage({
          type: "error",
          text: errorData.message || "Failed to update profile. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({
        type: "error",
        text: "An error occurred while updating your profile. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData(originalData)
    setErrors({})
    setMessage({ type: "", text: "" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Update Your Profile</h1>
          <p className="text-lg text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-2xl">
                    {formData.firstName.charAt(0)}
                    {formData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-rose-600 hover:bg-rose-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{formData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Account
                  </Badge>
                  {hasChanges && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Alert */}
        {message.text && (
          <Alert
            className={`mb-6 ${
              message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
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

        {/* Main Form */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className={`${errors.firstName ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className={`${errors.lastName ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={`pl-10 ${errors.email ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={`pl-10 ${errors.phone ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                    </div>
                  </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      🔒 Leave password fields empty if you don't want to change your password.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPasswords.password ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          className={`pr-10 ${errors.password ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, password: !prev.password }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                          className={`pr-10 ${errors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </TabsContent>

                {/* Address Tab */}
                <TabsContent value="address" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Street Address
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Enter your street address"
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="Enter your city"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleChange("postalCode", e.target.value)}
                          placeholder="Enter postal code"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                          Country
                        </Label>
                        <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PS">Palestine</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Saving Changes...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={saving || !hasChanges}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Reset Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
