import { type NextRequest, NextResponse } from "next/server"

// Mock data - في التطبيق الحقيقي، ستأتي من قاعدة البيانات
const allProducts = [
  {
    id: 1,
    title: "Elegant Evening Dress",
    image: "/images/dress1.webp",
    price: 89.99,
    originalPrice: 120.0,
    category: "evening",
    type: "dress",
    description: "Beautiful evening dress perfect for special occasions",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    title: "Casual Summer Dress",
    image: "/images/dress2.webp",
    price: 59.99,
    originalPrice: 79.99,
    category: "casual",
    type: "dress",
    description: "Light and comfortable summer dress",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 3,
    title: "Stylish Blouse",
    image: "/images/top1.png",
    price: 39.99,
    category: "casual",
    type: "top",
    description: "Versatile blouse for everyday wear",
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: 4,
    title: "Formal Shirt",
    image: "/images/top2.jpg",
    price: 49.99,
    category: "formal",
    type: "top",
    description: "Professional shirt for office wear",
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 5,
    title: "Party Dress",
    image: "/images/dress6.png",
    price: 79.99,
    originalPrice: 99.99,
    category: "evening",
    type: "dress",
    description: "Stunning party dress that turns heads",
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: 6,
    title: "Chic Top",
    image: "/images/top3.png",
    price: 34.99,
    category: "casual",
    type: "top",
    description: "Trendy top for casual outings",
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 7,
    title: "Maxi Dress",
    image: "/images/dress2-new.webp",
    price: 69.99,
    category: "casual",
    type: "dress",
    description: "Flowing maxi dress for comfort and style",
    rating: 4.6,
    reviewCount: 112,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    title: "Designer Top",
    image: "/images/tops-new.jpg",
    price: 54.99,
    originalPrice: 74.99,
    category: "formal",
    type: "top",
    description: "Designer top with premium quality",
    rating: 4.8,
    reviewCount: 145,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase().trim() || ""

    // التحقق من صحة الاستعلام
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        message: "Query too short",
      })
    }

    // البحث في المنتجات
    const results = allProducts.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(query)
      const categoryMatch = product.category.toLowerCase().includes(query)
      const typeMatch = product.type.toLowerCase().includes(query)
      const descriptionMatch = product.description.toLowerCase().includes(query)

      return titleMatch || categoryMatch || typeMatch || descriptionMatch
    })

    // ترتيب النتائج حسب الصلة
    const sortedResults = results.sort((a, b) => {
      // إعطاء أولوية للعنوان
      const aTitle = a.title.toLowerCase().includes(query) ? 1 : 0
      const bTitle = b.title.toLowerCase().includes(query) ? 1 : 0

      if (aTitle !== bTitle) return bTitle - aTitle

      // ثم حسب التقييم
      return b.rating - a.rating
    })

    return NextResponse.json({
      success: true,
      results: sortedResults.slice(0, 10), // أول 10 نتائج
      total: sortedResults.length,
      query: query,
    })
  } catch (error) {
    console.error("Quick search error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
