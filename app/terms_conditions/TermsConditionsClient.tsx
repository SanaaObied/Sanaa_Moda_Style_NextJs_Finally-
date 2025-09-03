"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FileText,
  Shield,
  CreditCard,
  RotateCcw,
  User,
  Lock,
  AlertTriangle,
  Scale,
  ChevronRight,
  Clock,
  CheckCircle,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"

interface Section {
  id: number
  title: string
  content: string
}

interface TermsData {
  title: string
  lastUpdated: string
  sections: Section[]
}

const sectionIcons: { [key: number]: any } = {
  1: FileText,
  2: Shield,
  3: CreditCard,
  4: RotateCcw,
  5: User,
  6: Lock,
  7: AlertTriangle,
  8: Scale,
}

export default function TermsConditionsClient({ termsData }: { termsData: TermsData }) {
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: number) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  if (!termsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading terms and conditions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Scale className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{termsData.title}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Welcome to Sonaa Moda Style. By accessing or using our website, you agree to comply with and be bound by the
            following terms and conditions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="h-5 w-5" />
              <span>Last Updated: {termsData.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <CheckCircle className="h-5 w-5" />
              <span>Legally Binding</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className={`sticky transition-all duration-300 ${isScrolled ? "top-8" : "top-4"}`}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {termsData.sections.map((section) => {
                    const IconComponent = sectionIcons[section.id] || FileText
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                          activeSection === section.id
                            ? "bg-purple-100 text-purple-700 shadow-sm"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <IconComponent className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{section.title}</span>
                        <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {termsData.sections.map((section) => {
                const IconComponent = sectionIcons[section.id] || FileText
                return (
                  <div
                    key={section.id}
                    id={`section-${section.id}`}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                        <IconComponent className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {section.id}. {section.title}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">{section.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contact Support Section */}
            <div className="mt-12 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Need Help Understanding Our Terms?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Our customer support team is here to help clarify any questions you may have.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Contact Support
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:sonnaamodastyle@gmail.com"
                    className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                  >
                    <Mail className="h-5 w-5" />
                    sonnaamodastyle@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/privacy_policy"
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Privacy Policy</h4>
                </div>
                <p className="text-gray-600 text-sm">Learn how we protect your personal information</p>
                <ChevronRight className="h-5 w-5 text-gray-400 mt-3 group-hover:text-blue-600 transition-colors" />
              </Link>

              <Link
                href="/return_policy"
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Return Policy</h4>
                </div>
                <p className="text-gray-600 text-sm">Understand our return and refund process</p>
                <ChevronRight className="h-5 w-5 text-gray-400 mt-3 group-hover:text-green-600 transition-colors" />
              </Link>

              <Link
                href="/contact"
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Contact Us</h4>
                </div>
                <p className="text-gray-600 text-sm">Get in touch with our support team</p>
                <ChevronRight className="h-5 w-5 text-gray-400 mt-3 group-hover:text-purple-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
