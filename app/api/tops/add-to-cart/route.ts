import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity = 1, size, color, type = "top" } = body

    // Validate required fields
    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    // Get the current origin from the request
    const origin = request.headers.get("origin") || `${request.nextUrl.protocol}//${request.nextUrl.host}`

    // Fetch product details
    let product = null
    try {
      const productResponse = await fetch(`${origin}/api/tops`)
      const productData = await productResponse.json()

      if (productData.success && productData.tops) {
        product = productData.tops.find((p: any) => p.id === productId)
      }
    } catch (fetchError) {
      console.error("Failed to fetch product details:", fetchError)
      // Continue without product details
    }

    // Simulate adding to cart (in real app, save to database)
    const cartItem = {
      id: Date.now(),
      productId,
      quantity,
      size: size || "M",
      color: color || "Default",
      type,
      title: product?.title || "Top",
      price: product?.price || "$0.00",
      image: product?.image || "/placeholder.svg",
      addedAt: new Date().toISOString(),
    }

    // In a real application, you would save this to a database
    // For now, we'll just return success
    console.log("Added to cart:", cartItem)

    return NextResponse.json({
      success: true,
      message: "Product added to cart successfully",
      cartItem,
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to add product to cart" }, { status: 500 })
  }
}
