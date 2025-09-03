import { type NextRequest, NextResponse } from "next/server"

function getOrigin(req: NextRequest) {
  // Works in local/dev/preview.  Example:  http://127.0.0.1:3000
  return new URL(req.url).origin
}

// محاكاة قاعدة بيانات السلة
const cartItems: Array<{
  id: string
  productId: number
  title: string
  image: string
  price: string
  priceValue: number
  size: string
  color?: string
  quantity: number
  type: string
  addedAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity = 1, size, color, type = "dress" } = body

    // التحقق من البيانات المطلوبة
    if (!productId || !size) {
      return NextResponse.json({ success: false, message: "Product ID and size are required" }, { status: 400 })
    }

    // ------------------------------------------------------------
    // Fetch product details from our own API (same origin).
    // ------------------------------------------------------------
    let product
    try {
      const origin = getOrigin(request)
      const apiPath = type === "dress" ? "/api/dresses" : type === "top" ? "/api/tops" : "/api/products"

      const productResponse = await fetch(`${origin}${apiPath}`)
      const json = await productResponse.json()
      const products = Array.isArray(json) ? json : (json.products ?? [])
      product = products.find((p: any) => p.id === productId)
    } catch (err) {
      console.warn("⚠️  Product fetch failed – continuing without server validation.", err)
      // Allow the request to continue; the client already knows the product id / size.
    }

    // If we couldn’t retrieve the product details, we’ll still
    // let the item be added (useful for offline demos).
    if (product && !product.sizes.includes(size)) {
      return NextResponse.json({ success: false, message: "Selected size is not available" }, { status: 400 })
    }

    // التحقق من وجود المنتج في السلة
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color,
    )

    if (existingItemIndex > -1) {
      // تحديث الكمية إذا كان المنتج موجود
      cartItems[existingItemIndex].quantity += quantity
    } else {
      // إضافة منتج جديد للسلة
      const newItem = {
        id: `${productId}-${size}-${color || "default"}-${Date.now()}`,
        productId,
        title: product?.title ?? `Product #${productId}`,
        image: product?.image ?? "/placeholder.svg",
        price: product?.price ?? "0.00",
        priceValue: product?.priceValue ?? 0,
        size,
        color: color || (product?.colors?.[0] ?? ""),
        quantity,
        type,
        addedAt: new Date().toISOString(),
      }
      cartItems.push(newItem)
    }

    // حساب إجمالي عدد العناصر
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      success: true,
      message: "Product added to cart successfully",
      cartCount: totalItems,
      item: cartItems[existingItemIndex] || cartItems[cartItems.length - 1],
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// GET method لجلب محتويات السلة
export async function GET() {
  try {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = cartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0)

    return NextResponse.json({
      success: true,
      items: cartItems,
      totalItems,
      totalValue: totalValue.toFixed(2),
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
