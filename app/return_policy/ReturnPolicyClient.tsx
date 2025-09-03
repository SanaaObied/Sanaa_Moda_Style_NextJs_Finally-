"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Package,
  Clock,
  CheckCircle,
  ArrowLeft,
  Mail,
  Shield,
  RefreshCw,
  AlertCircle,
  Phone,
  MessageCircle,
  CreditCard,
  Truck,
  FileText,
  Star,
} from "lucide-react"

interface PolicySection {
  title: string
  type: "paragraph" | "unordered-list" | "ordered-list" | "email"
  content?: string
  items?: string[]
  email?: string
}

interface PolicyData {
  lastUpdated: string
  sections: PolicySection[]
}

interface ReturnPolicyClientProps {
  policyData: PolicyData
  error?: string | null
}

export default function ReturnPolicyClient({ policyData, error }: ReturnPolicyClientProps) {
  const [activeSection, setActiveSection] = useState<number | null>(null)

  if (!policyData && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  const { lastUpdated, sections } = policyData

  const quickLinks = [
    { icon: Clock, title: "Return Period", section: 1 },
    { icon: CheckCircle, title: "Return Conditions", section: 2 },
    { icon: Package, title: "How to Return", section: 3 },
    { icon: CreditCard, title: "Refunds", section: 4 },
    { icon: RefreshCw, title: "Exchanges", section: 5 },
    { icon: Truck, title: "Shipping Costs", section: 6 },
  ]

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(index)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Unable to load latest policy data. Showing cached version.</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Your satisfaction is our priority. Easy returns, hassle-free refunds, and exceptional customer service.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">14-Day Return Window</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">Full Refund Guarantee</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">Free Return Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Quick Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-pink-600" />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(link.section)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === link.section
                          ? "bg-pink-50 text-pink-700 border-l-4 border-pink-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <link.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">{link.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Contact Support */}
                <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-pink-600" />
                    Need Help?
                  </h4>
                  <div className="space-y-2 text-sm">
                    <Link
                      href="mailto:sonnaamodastyle@gmail.com"
                      className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Form
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center text-pink-600 hover:text-pink-700 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Last Updated: {lastUpdated}
                  </div>
                </div>

                <article className="prose prose-lg max-w-none">
                  {sections.map((section, idx) => (
                    <section key={idx} id={`section-${idx}`} className="mb-12 scroll-mt-8">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border border-pink-100 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                          {idx === 0 && <Shield className="h-6 w-6 mr-3 text-pink-600" />}
                          {idx === 1 && <Clock className="h-6 w-6 mr-3 text-pink-600" />}
                          {idx === 2 && <CheckCircle className="h-6 w-6 mr-3 text-pink-600" />}
                          {idx === 3 && <Package className="h-6 w-6 mr-3 text-pink-600" />}
                          {idx === 4 && <CreditCard className="h-6 w-6 mr-3 text-pink-600" />}
                          {idx === 5 && <RefreshCw className="h-6 w-6 mr-3 text-pink-600" />}
                          {idx >= 6 && <Truck className="h-6 w-6 mr-3 text-pink-600" />}
                          {section.title}
                        </h2>

                        {section.type === "paragraph" && section.content && (
                          <p className="text-gray-700 leading-relaxed text-lg">{section.content}</p>
                        )}

                        {section.type === "unordered-list" && section.items && (
                          <ul className="space-y-3">
                            {section.items.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.type === "ordered-list" && section.items && (
                          <ol className="space-y-3">
                            {section.items.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                                  {i + 1}
                                </div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ol>
                        )}

                        {section.type === "email" && section.email && (
                          <div className="bg-white p-4 rounded-lg border border-pink-200">
                            <p className="text-gray-700 mb-2">Email us to request a return:</p>
                            <Link
                              href={`mailto:${section.email}`}
                              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              {section.email}
                            </Link>
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
                </article>

                {/* Trust Badges */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Secure Returns</h3>
                      <p className="text-sm text-gray-600">Your returns are processed securely and safely</p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
                      <p className="text-sm text-gray-600">98% customer satisfaction rate on returns</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
                      <p className="text-sm text-gray-600">Returns processed within 2-3 business days</p>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12 p-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
                    <p className="text-pink-100 mb-6">
                      Our customer service team is here to help with your return or refund
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="mailto:sonnaamodastyle@gmail.com"
                        className="inline-flex items-center px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Email Support
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Contact Form
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
