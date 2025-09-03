import { type NextRequest, NextResponse } from "next/server"

// Mock product data - في التطبيق الحقيقي ستأتي من قاعدة البيانات
const products = [
  {
    id: 1,
    title: "Elegant Evening Dress",
    image: "/images/dress1.webp",
    description:
      "A stunning evening dress perfect for special occasions. Features elegant design with premium fabric and comfortable fit.",
    price: "$89.99",
    priceValue: 89.99,
    originalPrice: "$120.00",
    ratings: ["5", "4", "5", "5", "4"],
    reviews: ["Absolutely beautiful dress!", "Perfect fit and quality", "Love the elegant design"],
    averageRating: 4.6,
    reviewCount: 34,
    category: "evening",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    isNew: true,
    isBestseller: true,
    isOnSale: true,
    fabric: "Premium Polyester Blend",
    care: ["Dry clean only", "Store hanging", "Iron on low heat"],
    type: "dress" as const,
  },
  {
    id: 2,
    title: "Casual Summer Dress",
    image: "/images/dress2.webp",
    description:
      "Light and breezy summer dress perfect for casual outings. Made with breathable fabric for all-day comfort.",
    price: "$59.99",
    priceValue: 59.99,
    ratings: ["4", "5", "4", "4", "5"],
    reviews: ["Great for summer!", "Very comfortable", "Love the style"],
    averageRating: 4.4,
    reviewCount: 28,
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Light Blue", "Pink"],
    isNew: false,
    isBestseller: false,
    isOnSale: false,
    fabric: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    type: "dress" as const,
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 })
    }

    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}
