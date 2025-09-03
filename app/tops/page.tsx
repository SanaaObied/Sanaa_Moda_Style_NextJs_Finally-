import type { Metadata } from "next"
import TopsClient from "./TopsClient"

export const metadata: Metadata = {
  title: "Tops Collection - Sonaa Moda Style",
  description:
    "Discover our stunning collection of stylish and comfortable tops. From casual to elegant, find the perfect top for every occasion.",
  keywords: "tops, blouses, shirts, fashion, women's clothing, Sonaa Moda Style",
  openGraph: {
    title: "Stylish Tops Collection - Sonaa Moda Style",
    description: "Explore our beautiful range of tops and blouses",
    images: ["/images/tops-collection-og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
}

interface Top {
  id: number
  title: string
  image: string
  description: string
  price: string
  originalPrice?: string
  discount?: number
  ratings: string[]
  reviews: string[]
  sizes: string[]
  colors: string[]
  category: string
  isNew?: boolean
  isBestseller?: boolean
}

async function fetchTops(): Promise<Top[]> {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000"

  const url = `${baseUrl}/api/tops`

  try {
    const res = await fetch(url, { cache: "no-store" })

    if (!res.ok) {
      console.error("Failed to fetch tops – status:", res.status)
      return []
    }

    // Ensure we really received JSON
    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      console.error("Unexpected content type:", contentType)
      return []
    }

    return (await res.json()) as Top[]
  } catch (err) {
    console.error("Failed to fetch tops:", err)
    return []
  }
}

export default async function TopsPage() {
  const tops = await fetchTops()

  if (!tops.length) {
    return (
      <main className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Tops</h2>
        <p className="text-gray-600">No tops available right now. Please try again later.</p>
      </main>
    )
  }

  return <TopsClient initialTops={tops} />
}
