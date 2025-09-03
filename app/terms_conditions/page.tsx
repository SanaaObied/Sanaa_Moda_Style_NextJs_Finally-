import type { Metadata } from "next"
import TermsConditionsClient from "./TermsConditionsClient"

export const metadata: Metadata = {
  title: "Terms and Conditions - Sonaa Moda Style",
  description: "Read the terms and conditions for using Sonaa Moda Style's website and services.",
  keywords: "terms, conditions, legal, policy, Sonaa Moda Style",
  openGraph: {
    title: "Terms and Conditions - Sonaa Moda Style",
    description: "Read the terms and conditions for using Sonaa Moda Style's website and services.",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
}

async function fetchTermsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/terms_conditions`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch terms data")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching terms data:", error)
    // Return fallback data
    return {
      title: "Terms and Conditions",
      lastUpdated: "March 30, 2024",
      sections: [
        {
          id: 1,
          title: "Use of Website",
          content: "You may browse and use our website for personal, non-commercial use only.",
        },
      ],
    }
  }
}

export default async function TermsConditionsPage() {
  const data = await fetchTermsData()

  return <TermsConditionsClient termsData={data} />
}
