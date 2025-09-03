import "../../app/globals.css"
import { Shield, Lock, Eye, Users, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - Sonaa Moda Style",
  description: "Learn how we collect, use, and protect your personal information at Sonaa Moda Style.",
  keywords: "privacy policy, data protection, personal information, security",
  openGraph: {
    title: "Privacy Policy - Sonaa Moda Style",
    description: "Your privacy matters to us. Learn about our data practices.",
    type: "website",
  },
}

interface Section {
  title: string
  content?: string
  list?: string[]
  icon?: any
  type?: "info" | "warning" | "success"
}

interface PrivacyData {
  lastUpdated: string
  sections: Section[]
}

export default async function PrivacyPolicy() {
  let data: PrivacyData

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/privacy_policy`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch privacy policy")
    }

    data = await res.json()
  } catch (error) {
    console.error("Error fetching privacy policy:", error)
    // Fallback data
    data = {
      lastUpdated: "March 30, 2024",
      sections: [
        {
          title: "Overview",
          content:
            "Your privacy is important to us. This Privacy Policy outlines how we handle your personal information.",
        },
      ],
    }
  }

  const sectionIcons: { [key: string]: any } = {
    Overview: Shield,
    "Information We Collect": FileText,
    "How We Use Your Information": Users,
    "How We Protect Your Information": Lock,
    "Sharing Your Information": Eye,
    "Your Rights": CheckCircle,
    "Changes to This Privacy Policy": Clock,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Shield className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your privacy and data security are our top priorities. Learn how we protect and handle your personal
            information.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-200">
            <Clock className="w-5 h-5" />
            <span>Last Updated: {data.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Table of Contents
          </h2>
          <div className="grid md:grid-cols-2 gap-2">
            {data.sections.map((section, idx) => {
              const IconComponent = sectionIcons[section.title] || FileText
              return (
                <a
                  key={idx}
                  href={`#section-${idx}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <IconComponent className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-blue-700 font-medium">{section.title}</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {data.sections.map((section, idx) => {
            const IconComponent = sectionIcons[section.title] || FileText

            return (
              <section key={idx} id={`section-${idx}`} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {section.title}
                  </h2>
                </div>

                <div className="p-6">
                  {section.content && (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">{section.content}</p>
                    </div>
                  )}

                  {section.list && (
                    <div className="mt-4">
                      <ul className="space-y-3">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="bg-blue-100 p-1 rounded-full mt-1">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700 text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle your personal information, please don't
            hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="mailto:privacy@sonamodastyle.com"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Email Privacy Team
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Data is Protected</h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <Lock className="w-5 h-5 text-green-600" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span>Secure Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
