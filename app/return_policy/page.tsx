import type { Metadata } from "next"
import ReturnPolicyClient from "./ReturnPolicyClient"

export const metadata: Metadata = {
  title: "Return & Refund Policy - Sonaa Moda Style",
  description:
    "Learn about our hassle-free return and refund policy. Easy returns within 14 days with full refund guarantee.",
  keywords: "return policy, refund policy, exchange, Sonaa Moda Style",
  openGraph: {
    title: "Return & Refund Policy - Sonaa Moda Style",
    description: "Hassle-free returns and refunds for your peace of mind",
    type: "website",
  },
}

// ----------  NEW HELPER  ----------
function getReturnPolicyUrl() {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") // strip trailing slash

  if (base) {
    return `${base}/api/return_policy`
  }

  // Fallback for local development on server-side: use localhost URL explicitly
  if (typeof window === "undefined") {
    return "http://localhost:3000/api/return_policy"
  }

  // Client-side fallback: relative URL works fine in browser
  return "/api/return_policy"
}

// ---------------------------------

export default async function ReturnPolicyPage() {
  let policyData: any = null
  let error: string | null = null

  try {
    const res = await fetch(getReturnPolicyUrl(), { cache: "no-store" })

    // Ensure the response is JSON before parsing
    const isJson = res.headers.get("content-type")?.includes("application/json")

    if (!res.ok || !isJson) {
      throw new Error(`Invalid response${!isJson ? " (non-JSON)" : ""}: status ${res.status}`)
    }

    policyData = (await res.json()) as any
  } catch (err) {
    console.error("Failed to fetch return policy:", err)
    error = err instanceof Error ? err.message : "Unknown error while fetching"
    // Fallback minimal data so the UI still renders
    policyData = {
      lastUpdated: "N/A",
      sections: [
        {
          title: "Return Policy Unavailable",
          type: "paragraph",
          content: "We’re unable to load the full return policy right now. Please try again later.",
        },
      ],
    }
  }

  return <ReturnPolicyClient policyData={policyData} error={error} />
}
