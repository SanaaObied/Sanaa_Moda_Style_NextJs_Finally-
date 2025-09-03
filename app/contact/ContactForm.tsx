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
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"

interface ContactFormData {
  senderName: string
  senderEmail: string
  senderLocation: string
  messageSubject: string
  messageBody: string
  inquiryType: string
  phoneNumber: string
}

interface ValidationErrors {
  [key: string]: string
}

export default function ContactForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ContactFormData>({
    senderName: "",
    senderEmail: "",
    senderLocation: "",
    messageSubject: "",
    messageBody: "",
    inquiryType: "",
    phoneNumber: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "order", label: "Order Support" },
    { value: "product", label: "Product Question" },
    { value: "return", label: "Return/Exchange" },
    { value: "complaint", label: "Complaint" },
    { value: "partnership", label: "Business Partnership" },
    { value: "other", label: "Other" },
  ]

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Required fields validation
    if (!formData.senderName.trim()) newErrors.senderName = "Name is required"
    if (!formData.senderEmail.trim()) newErrors.senderEmail = "Email is required"
    if (!formData.messageSubject.trim()) newErrors.messageSubject = "Subject is required"
    if (!formData.messageBody.trim()) newErrors.messageBody = "Message is required"
    if (!formData.inquiryType) newErrors.inquiryType = "Please select inquiry type"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.senderEmail && !emailRegex.test(formData.senderEmail)) {
      newErrors.senderEmail = "Please enter a valid email address"
    }

    // Phone validation (if provided)
    if (formData.phoneNumber) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(formData.phoneNumber.replace(/[-\s]/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number"
      }
    }

    // Message length validation
    if (formData.messageBody && formData.messageBody.length < 10) {
      newErrors.messageBody = "Message must be at least 10 characters long"
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

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Thank you for your message! We'll get back to you within 24 hours.",
        })
        // Reset form
        setFormData({
          senderName: "",
          senderEmail: "",
          senderLocation: "",
          messageSubject: "",
          messageBody: "",
          inquiryType: "",
          phoneNumber: "",
        })
        // Redirect to thank you page after 3 seconds
        setTimeout(() => {
          router.push("/thank-you")
        }, 3000)
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send message. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      senderName: "",
      senderEmail: "",
      senderLocation: "",
      messageSubject: "",
      messageBody: "",
      inquiryType: "",
      phoneNumber: "",
    })
    setErrors({})
    setMessage({ type: "", text: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store Info Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                  <MapPin className="h-6 w-6 text-rose-600 mr-2" />
                  Visit Our Store
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Address</p>
                    <p className="text-gray-600">Abu-Falah, Ramallah, Palestine</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <p className="text-gray-600">+972-592-845-459</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-600">sonaamodastyle@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Business Hours</p>
                    <p className="text-gray-600">Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => window.open("https://wa.me/972592845459", "_blank")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp Chat
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => window.open("tel:+972592845459")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-rose-300 text-rose-700 hover:bg-rose-50"
                  onClick={() => window.open("mailto:sonaamodastyle@gmail.com")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button size="sm" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-sky-300 text-sky-600 hover:bg-sky-50">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Send Us a Message</CardTitle>
                <p className="text-gray-600 mt-2">We typically respond within 24 hours</p>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="senderName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="senderName"
                          value={formData.senderName}
                          onChange={(e) => handleChange("senderName", e.target.value)}
                          className={`pl-10 ${errors.senderName ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.senderName && <p className="text-xs text-red-600">{errors.senderName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senderEmail" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="senderEmail"
                          type="email"
                          value={formData.senderEmail}
                          onChange={(e) => handleChange("senderEmail", e.target.value)}
                          className={`pl-10 ${errors.senderEmail ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.senderEmail && <p className="text-xs text-red-600">{errors.senderEmail}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                        Phone Number (Optional)
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleChange("phoneNumber", e.target.value)}
                          className={`pl-10 ${errors.phoneNumber ? "border-red-300 focus:border-red-500" : ""}`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senderLocation" className="text-sm font-medium text-gray-700">
                        Location (City)
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="senderLocation"
                          value={formData.senderLocation}
                          onChange={(e) => handleChange("senderLocation", e.target.value)}
                          className="pl-10"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType" className="text-sm font-medium text-gray-700">
                      Inquiry Type *
                    </Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleChange("inquiryType", value)}>
                      <SelectTrigger className={`${errors.inquiryType ? "border-red-300 focus:border-red-500" : ""}`}>
                        <SelectValue placeholder="Select the type of your inquiry" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.inquiryType && <p className="text-xs text-red-600">{errors.inquiryType}</p>}
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="messageSubject" className="text-sm font-medium text-gray-700">
                      Subject *
                    </Label>
                    <Input
                      id="messageSubject"
                      value={formData.messageSubject}
                      onChange={(e) => handleChange("messageSubject", e.target.value)}
                      className={`${errors.messageSubject ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Brief description of your inquiry"
                    />
                    {errors.messageSubject && <p className="text-xs text-red-600">{errors.messageSubject}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="messageBody" className="text-sm font-medium text-gray-700">
                      Message *
                    </Label>
                    <Textarea
                      id="messageBody"
                      value={formData.messageBody}
                      onChange={(e) => handleChange("messageBody", e.target.value)}
                      className={`min-h-32 ${errors.messageBody ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Please provide details about your inquiry..."
                    />
                    <div className="flex justify-between items-center">
                      {errors.messageBody && <p className="text-xs text-red-600">{errors.messageBody}</p>}
                      <p className="text-xs text-gray-500 ml-auto">{formData.messageBody.length}/500 characters</p>
                    </div>
                  </div>

                  {/* Response Time Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <p className="text-blue-800 text-sm font-medium">Expected Response Time</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 text-xs">General Inquiries:</span>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          24 hours
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 text-xs">Order Support:</span>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          4-6 hours
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 text-xs">Urgent Issues:</span>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          2 hours
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={loading}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">Frequently Asked Questions</CardTitle>
              <p className="text-gray-600">Quick answers to common questions</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What are your shipping options?</h4>
                    <p className="text-gray-600 text-sm">
                      We offer standard (3-5 days) and express (1-2 days) shipping within Palestine.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I return or exchange items?</h4>
                    <p className="text-gray-600 text-sm">
                      Yes, we accept returns within 14 days of purchase with original tags and receipt.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Do you offer custom sizing?</h4>
                    <p className="text-gray-600 text-sm">
                      We offer alterations for select items. Contact us for more information.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How can I track my order?</h4>
                    <p className="text-gray-600 text-sm">
                      You'll receive a tracking number via email once your order ships.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
