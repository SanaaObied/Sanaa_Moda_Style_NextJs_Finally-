import { type NextRequest, NextResponse } from "next/server"

// Mock data للفساتين الإضافية
const additionalDresses = [
  {
    id: 21,
    title: "Vintage Floral Dress",
    image: "/images/dress2-new.webp",
    description: "Beautiful vintage-inspired floral dress perfect for spring occasions",
    price: "$75.00",
    priceValue: 75,
    originalPrice: "$95.00",
    ratings: ["5", "4", "5", "4", "5"],
    reviews: ["Love the vintage style!", "Perfect fit and quality", "Beautiful floral pattern"],
    averageRating: 4.6,
    reviewCount: 23,
    category: "vintage",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral", "Blue", "Pink"],
    isNew: true,
    isBestseller: false,
    isOnSale: true,
    fabric: "100% Cotton",
    care: ["Machine wash cold", "Hang dry", "Iron on low heat"],
  },
  {
    id: 22,
    title: "Modern Midi Dress",
    image: "/images/dress6.png",
    description: "Contemporary midi dress with clean lines and elegant silhouette",
    price: "$68.00",
    priceValue: 68,
    ratings: ["4", "5", "4", "4", "5"],
    reviews: ["Great for office wear", "Comfortable and stylish", "Perfect length"],
    averageRating: 4.4,
    reviewCount: 18,
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    isNew: false,
    isBestseller: true,
    isOnSale: false,
    fabric: "Polyester blend",
    care: ["Dry clean only", "Store hanging"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // حساب البيانات للصفحة المطلوبة
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDresses = additionalDresses.slice(startIndex, endIndex)

    const hasMore = endIndex < additionalDresses.length

    return NextResponse.json({
      success: true,
      dresses: paginatedDresses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(additionalDresses.length / limit),
        hasMore,
        total: additionalDresses.length,
      },
    })
  } catch (error) {
    console.error("Load more dresses error:", error)
    return NextResponse.json({ success: false, error: "Failed to load more dresses" }, { status: 500 })
  }
}
