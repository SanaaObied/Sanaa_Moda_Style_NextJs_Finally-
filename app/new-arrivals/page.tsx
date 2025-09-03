import type { Metadata } from "next"
import NewArrivalsClient from "./NewArrivalsClient"

export const metadata: Metadata = {
  title: "New Arrivals - Sonaa Moda Style",
  description:
    "Discover the latest fashion trends and new arrivals at Sonaa Moda Style. Fresh styles, premium quality, and unbeatable prices.",
  keywords: "new arrivals, latest fashion, trending styles, women's clothing, fashion trends",
  openGraph: {
    title: "New Arrivals - Sonaa Moda Style",
    description: "Discover the latest fashion trends and new arrivals",
    images: ["/images/new-arrivals-banner.jpg"],
  },
}

interface Product {
  id: number
  title: string
  image: string
  description: string
  price: number
  originalPrice?: number
  category: string
  isNew: boolean
  isBestseller: boolean
  discount?: number
  ratings: number
  reviewCount: number
  colors: string[]
  sizes: string[]
  tags: string[]
  dateAdded: string
}

async function fetchNewArrivals(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    const url = baseUrl ? `${baseUrl}/api/new-arrivals` : "/api/new-arrivals"

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON")
    }

    return await res.json()
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error)

    // Fallback data
    return [
      {
        id: 1,
        title: "Elegant Summer Dress",
        image: "/images/dress1.webp",
        description: "Beautiful floral summer dress perfect for any occasion",
        price: 89.99,
        originalPrice: 119.99,
        category: "Dresses",
        isNew: true,
        isBestseller: false,
        discount: 25,
        ratings: 4.8,
        reviewCount: 24,
        colors: ["Blue", "Pink", "White"],
        sizes: ["S", "M", "L", "XL"],
        tags: ["summer", "floral", "elegant"],
        dateAdded: "2024-01-15",
      },
      {
        id: 2,
        title: "Casual Striped Top",
        image: "/images/top1.png",
        description: "Comfortable striped top for everyday wear",
        price: 34.99,
        category: "Tops",
        isNew: true,
        isBestseller: true,
        ratings: 4.6,
        reviewCount: 18,
        colors: ["Navy", "Red", "Green"],
        sizes: ["XS", "S", "M", "L"],
        tags: ["casual", "striped", "comfortable"],
        dateAdded: "2024-01-10",
      },
    ]
  }
}

export default async function NewArrivalsPage() {
  const products = await fetchNewArrivals()

  return <NewArrivalsClient products={products} />
}
