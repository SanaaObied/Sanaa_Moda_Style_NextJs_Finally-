import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, size, type = "dress" } = body

    // التحقق من البيانات
    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 })
    }

    // الحصول على بيانات المنتج
    let product
    try {
      const productResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/${type === "dress" ? "dresses" : "tops"}`,
      )
      const productsData = await productResponse.json()
      const products = Array.isArray(productsData) ? productsData : productsData.products || []
      product = products.find((p: any) => p.id === productId)
    } catch (error) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    // إذا لم يتم تحديد مقاس وكان هناك مقاس واحد فقط
    let selectedSize = size
    if (!selectedSize && product.sizes.length === 1) {
      selectedSize = product.sizes[0]
    }

    // إذا لم يكن هناك مقاس محدد وهناك عدة مقاسات
    if (!selectedSize && product.sizes.length > 1) {
      return NextResponse.json({
        success: false,
        requiresSizeSelection: true,
        product: {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          sizes: product.sizes,
        },
        message: "Please select a size",
      })
    }

    // إضافة للسلة باستخدام API الموجود
    const addToCartResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/cart/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: selectedSize,
          type,
        }),
      },
    )

    const addToCartData = await addToCartResponse.json()

    if (addToCartData.success) {
      return NextResponse.json({
        success: true,
        message: `${product.title} added to cart successfully!`,
        cartCount: addToCartData.cartCount,
        item: addToCartData.item,
      })
    } else {
      return NextResponse.json({ success: false, message: addToCartData.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Quick add error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
