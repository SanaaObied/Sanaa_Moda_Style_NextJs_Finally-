import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = {
      lastUpdated: "March 30, 2024",
      sections: [
        {
          title: "Overview",
          content:
            "At Sonaa Moda Style, your privacy is fundamental to our relationship with you. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us. We are committed to protecting your personal information and your right to privacy.",
          type: "info",
        },
        {
          title: "Information We Collect",
          content:
            "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include:",
          list: [
            "Personal identification information (Name, email address, phone number)",
            "Billing and shipping addresses",
            "Payment information (processed securely through our payment providers)",
            "Order history and preferences",
            "Communication preferences and marketing consent",
            "Device and browser information for website optimization",
          ],
          type: "info",
        },
        {
          title: "How We Use Your Information",
          content: "We use the information we collect for various purposes, including:",
          list: [
            "Processing and fulfilling your orders and transactions",
            "Providing customer service and support",
            "Sending order confirmations and shipping notifications",
            "Improving our website, products, and services",
            "Personalizing your shopping experience",
            "Sending promotional emails and marketing communications (with your consent)",
            "Preventing fraud and ensuring website security",
            "Complying with legal obligations",
          ],
          type: "success",
        },
        {
          title: "How We Protect Your Information",
          content:
            "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure servers, regular security audits, and staff training on data protection. However, no method of transmission over the internet is 100% secure.",
          type: "warning",
        },
        {
          title: "Sharing Your Information",
          content:
            "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:",
          list: [
            "With trusted service providers who assist us in operating our website and conducting business",
            "With shipping companies to deliver your orders",
            "With payment processors to handle transactions securely",
            "When required by law or to protect our rights and safety",
            "In connection with a business transfer or merger (with prior notice)",
          ],
          type: "warning",
        },
        {
          title: "Your Rights",
          content: "You have several rights regarding your personal information:",
          list: [
            "Access: Request a copy of the personal information we hold about you",
            "Correction: Request correction of inaccurate or incomplete information",
            "Deletion: Request deletion of your personal information (subject to legal requirements)",
            "Portability: Request transfer of your data to another service provider",
            "Opt-out: Unsubscribe from marketing communications at any time",
            "Restriction: Request limitation of how we process your information",
          ],
          type: "success",
        },
        {
          title: "Cookies and Tracking",
          content:
            "We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.",
          type: "info",
        },
        {
          title: "Third-Party Links",
          content:
            "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.",
          type: "warning",
        },
        {
          title: "Children's Privacy",
          content:
            "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.",
          type: "warning",
        },
        {
          title: "International Data Transfers",
          content:
            "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.",
          type: "info",
        },
        {
          title: "Data Retention",
          content:
            "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.",
          type: "info",
        },
        {
          title: "Changes to This Privacy Policy",
          content:
            'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.',
          type: "info",
        },
      ],
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error in privacy policy API:", error)
    return NextResponse.json({ error: "Failed to load privacy policy" }, { status: 500 })
  }
}
