import { type NextRequest, NextResponse } from "next/server"

const products = [
  // Dresses
  {
    id: 1,
    name: "Elegant Evening Gown",
    description:
      "A stunning emerald green one-shoulder evening gown with ruffle details and thigh-high slit, perfect for special occasions",
    price: 299.99,
    originalPrice: 399.99,
    category: "dresses",
    image: "/images/dress2-new.webp",
    images: ["/images/dress2-new.webp", "/images/dress2.webp"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Emerald Green", "Navy", "Black"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 32,
  },
  {
    id: 2,
    name: "Floral Print Midi Dress",
    description:
      "Beautiful pink and magenta floral print midi dress with a fitted silhouette, perfect for day or evening wear",
    price: 149.99,
    originalPrice: 199.99,
    category: "dresses",
    image: "/images/dress6.png",
    images: ["/images/dress6.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink Floral", "Blue Floral", "Green Floral"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: 3,
    name: "Bohemian Maxi Dresses",
    description:
      "Collection of flowing bohemian maxi dresses in vibrant patterns - yellow, burgundy, and orange prints",
    price: 89.99,
    originalPrice: 129.99,
    category: "dresses",
    image: "/images/dress.jpg",
    images: ["/images/dress.jpg", "/images/dress1.webp"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow", "Burgundy", "Orange"],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviewCount: 24,
  },
  {
    id: 4,
    name: "Red Ruffle Desert Dress",
    description:
      "Stunning red ruffled dress perfect for special occasions, featuring flowing layers and elegant silhouette",
    price: 179.99,
    originalPrice: 229.99,
    category: "dresses",
    image: "/images/dress1.webp",
    images: ["/images/dress1.webp"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red", "Black", "Navy"],
    inStock: true,
    featured: false,
    rating: 4.8,
    reviewCount: 19,
  },

  // Tops
  {
    id: 5,
    name: "Cable Knit Sweater Vest",
    description:
      "Luxurious cream cable-knit sweater vest perfect for layering over shirts, offering both style and comfort",
    price: 79.99,
    originalPrice: 99.99,
    category: "tops",
    image: "/images/top1-new.png",
    images: ["/images/top1-new.png", "/images/top1.png"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream", "Beige", "Light Gray"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 35,
  },
  {
    id: 6,
    name: "Floral Peplum Top",
    description:
      "Charming pink floral peplum top with ruffled sleeves and lace trim, perfect for casual and semi-formal occasions",
    price: 59.99,
    originalPrice: 79.99,
    category: "tops",
    image: "/images/top2-new.jpg",
    images: ["/images/top2-new.jpg", "/images/top2.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink Floral", "Blue Floral", "White Floral"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: 7,
    name: "Red Eyelet Blouse",
    description: "Elegant red eyelet blouse with intricate broderie anglaise details and three-quarter sleeves",
    price: 69.99,
    originalPrice: 89.99,
    category: "tops",
    image: "/images/top3-new.png",
    images: ["/images/top3-new.png", "/images/top3.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "White", "Navy", "Black"],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviewCount: 26,
  },
  {
    id: 8,
    name: "Casual Summer Tops Collection",
    description: "Versatile collection of casual summer tops including floral prints, tank tops, and textured designs",
    price: 39.99,
    originalPrice: 59.99,
    category: "tops",
    image: "/images/tops-new.jpg",
    images: ["/images/tops-new.jpg", "/images/tops.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue Floral", "Pink", "Sage Green"],
    inStock: true,
    featured: true,
    rating: 4.5,
    reviewCount: 38,
  },

  // Bottoms
  {
    id: 9,
    name: "Premium Bottoms Collection",
    description:
      "Complete your look with our selection of tailored pants, designer jeans, and flowing skirts in various styles",
    price: 89.99,
    originalPrice: 119.99,
    category: "bottoms",
    image: "/images/Botom.webp",
    images: ["/images/Botom.webp"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Beige", "Denim Blue"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 31,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const sortBy = searchParams.get("sortBy") || "featured"

    let filteredProducts = [...products]

    // Filter by category
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    }

    // Filter by featured
    if (featured === "true") {
      filteredProducts = filteredProducts.filter((product) => product.featured)
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id - a.id
        case "featured":
        default:
          return b.featured ? 1 : -1
      }
    })

    // Limit results
    if (limit) {
      const limitNum = Number.parseInt(limit)
      filteredProducts = filteredProducts.slice(0, limitNum)
    }

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length,
      categories: ["dresses", "tops", "bottoms"],
      filters: {
        priceRange: {
          min: Math.min(...products.map((p) => p.price)),
          max: Math.max(...products.map((p) => p.price)),
        },
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Red", "Pink", "Blue", "Green", "Navy", "Cream"],
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)

    return NextResponse.json(
      {
        error: "Server error",
        message: "Unable to fetch products",
      },
      { status: 500 },
    )
  }
}
