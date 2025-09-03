import { NextResponse } from "next/server"

const termsData = {
  title: "Terms and Conditions",
  lastUpdated: "March 30, 2024",
  sections: [
    {
      id: 1,
      title: "Use of Website",
      content:
        "You may browse and use our website for personal, non-commercial use only. Unauthorized use of this site may give rise to a claim for damages and/or be a criminal offense. You agree not to use the website for any unlawful purpose or in any way that could damage, disable, overburden, or impair our servers or networks.",
    },
    {
      id: 2,
      title: "Product Information",
      content:
        "We strive to display the most accurate product descriptions, pricing, and images. However, we do not guarantee the accuracy, completeness, or reliability of this information. Prices and availability are subject to change without notice. Colors may vary slightly due to monitor settings and photography conditions.",
    },
    {
      id: 3,
      title: "Orders and Payments",
      content:
        "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Payments must be made in full at the time of purchase using accepted methods. We accept major credit cards, PayPal, and other secure payment methods. All transactions are processed securely.",
    },
    {
      id: 4,
      title: "Returns and Refunds",
      content:
        "Our return and refund policy is detailed on the Return Policy page. Please read it carefully before requesting a return or exchange. Items must be returned within 14 days in original condition with tags attached. Refunds will be processed within 7-10 business days after approval.",
    },
    {
      id: 5,
      title: "User Account",
      content:
        "If you create an account with us, you are responsible for maintaining the confidentiality of your account and password. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate your account if misuse or fraud is suspected.",
    },
    {
      id: 6,
      title: "Privacy",
      content:
        "We value your privacy and are committed to protecting your personal information. For more information on how we collect, use, and protect your data, please refer to our Privacy Policy. We comply with applicable data protection laws and regulations.",
    },
    {
      id: 7,
      title: "Limitation of Liability",
      content:
        "Sonaa Moda Style shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this website or products purchased through it. Our total liability shall not exceed the amount paid for the specific product or service in question.",
    },
    {
      id: 8,
      title: "Governing Law",
      content:
        "These terms and conditions are governed by and construed in accordance with the laws of Palestine. Any disputes arising from these terms or your use of our website will be subject to the exclusive jurisdiction of the courts of Ramallah, Palestine.",
    },
  ],
}

export async function GET() {
  try {
    // Simulate a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json(termsData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error in terms_conditions API:", error)
    return NextResponse.json({ error: "Failed to fetch terms data" }, { status: 500 })
  }
}
