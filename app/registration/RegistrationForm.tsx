"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { User, Mail, Phone, MapPin, UserPlus, CheckCircle, AlertCircle, Eye, EyeOff, Lock, Shield } from "lucide-react"

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  telNo: string
  Address: string
  city: string
  postalCode: string
  country: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

interface ValidationErrors {
  [key: string]: string
}

export default function RegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    telNo: "",
    Address: "",
    city: "",
    postalCode: "",
    country: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  })

  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false })
  const [message, setMessage] = useState({ type: "", text: "" })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const totalSteps = 3
  const progressPercentage = (currentStep / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {}

    if (step === 1) {
      // Personal Information validation
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      if (!formData.telNo.trim()) newErrors.telNo = "Phone number is required"

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }

      // Phone validation
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (formData.telNo && !phoneRegex.test(formData.telNo.replace(/[-\s]/g, ""))) {
        newErrors.telNo = "Please enter a valid phone number"
      }
    }

    if (step === 2) {
      // Password validation
      if (!formData.password) newErrors.password = "Password is required"
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long"
      }
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }

      // Address validation
      if (!formData.Address.trim()) newErrors.Address = "Address is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.country) newErrors.country = "Please select your country"
    }

    if (step === 3) {
      // Terms validation
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    // Clear message when user starts typing
    if (message.text) setMessage({ type: "", text: "" })
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      setMessage({ type: "error", text: "Please fix the errors below" })
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Registration successful! Redirecting to thank you page...",
        })
        setTimeout(() => {
          router.push("/ThankRegister")
        }, 2000)
      } else {
        setMessage({
          type: "error",
          text: data.error || "Registration failed. Please try again.",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-rose-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

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
                <Label htmlFor="telNo" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="telNo"
                    type="tel"
                    value={formData.telNo}
                    onChange={(e) => handleChange("telNo", e.target.value)}
                    className={`pl-10 ${errors.telNo ? "border-red-300 focus:border-red-500" : ""}`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.telNo && <p className="text-xs text-red-600">{errors.telNo}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Lock className="h-6 w-6 text-rose-600" />
                <MapPin className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Security & Address</h3>
              <p className="text-gray-600">Set up your password and address</p>
            </div>

            <div className="space-y-6">
              {/* Password Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Account Security
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPasswords.password ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className={`pr-10 ${errors.password ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Create a password"
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
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className={`pr-10 ${errors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Confirm your password"
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
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Information
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="Address" className="text-sm font-medium text-gray-700">
                    Street Address *
                  </Label>
                  <Textarea
                    id="Address"
                    value={formData.Address}
                    onChange={(e) => handleChange("Address", e.target.value)}
                    className={`${errors.Address ? "border-red-300 focus:border-red-500" : ""}`}
                    placeholder="Enter your street address"
                    rows={3}
                  />
                  {errors.Address && <p className="text-xs text-red-600">{errors.Address}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className={`${errors.city ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Enter your city"
                    />
                    {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
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
                      Country *
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                      <SelectTrigger className={`${errors.country ? "border-red-300 focus:border-red-500" : ""}`}>
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
                    {errors.country && <p className="text-xs text-red-600">{errors.country}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Almost Done!</h3>
              <p className="text-gray-600">Review your information and complete registration</p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-gray-800">Registration Summary</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name:</p>
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone:</p>
                  <p className="font-medium">{formData.telNo}</p>
                </div>
                <div>
                  <p className="text-gray-600">Country:</p>
                  <p className="font-medium">{formData.country}</p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleChange("agreeToTerms", checked as boolean)}
                  className={`mt-1 ${errors.agreeToTerms ? "border-red-300" : ""}`}
                />
                <div className="space-y-1">
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer">
                    I agree to the{" "}
                    <a href="/terms_conditions" className="text-rose-600 hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy_policy" className="text-rose-600 hover:underline">
                      Privacy Policy
                    </a>{" "}
                    *
                  </Label>
                  {errors.agreeToTerms && <p className="text-xs text-red-600">{errors.agreeToTerms}</p>}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => handleChange("subscribeNewsletter", checked as boolean)}
                />
                <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-700 cursor-pointer">
                  Subscribe to our newsletter for exclusive offers and fashion updates
                </Label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Sonaa Moda Style</h1>
          <p className="text-lg text-gray-600">Create your account and start your fashion journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Main Form Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Customer Registration</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message Alert */}
            {message.text && (
              <Alert
                className={`${
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

            <form onSubmit={handleSubmit}>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Complete Registration
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/account" className="text-rose-600 hover:text-rose-700 font-medium hover:underline">
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
