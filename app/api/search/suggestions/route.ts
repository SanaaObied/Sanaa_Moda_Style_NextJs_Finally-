import { type NextRequest, NextResponse } from "next/server"

const popularSearches = [
  "evening dress",
  "casual dress",
  "summer dress",
  "party dress",
  "formal shirt",
  "blouse",
  "maxi dress",
  "designer top",
]

const categories = ["dresses", "tops", "evening wear", "casual wear", "formal wear"]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase().trim() || ""

    if (!query) {
      return NextResponse.json({
        success: true,
        suggestions: popularSearches.slice(0, 5),
        categories: categories.slice(0, 3),
      })
    }

    // البحث في الاقتراحات
    const matchingSuggestions = popularSearches.filter((search) => search.toLowerCase().includes(query))

    const matchingCategories = categories.filter((category) => category.toLowerCase().includes(query))

    return NextResponse.json({
      success: true,
      suggestions: matchingSuggestions.slice(0, 5),
      categories: matchingCategories.slice(0, 3),
      query: query,
    })
  } catch (error) {
    console.error("Search suggestions error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get suggestions",
      },
      { status: 500 },
    )
  }
}
