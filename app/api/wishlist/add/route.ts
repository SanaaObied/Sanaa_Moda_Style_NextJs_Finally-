import { NextResponse } from "next/server"
import { wishlistStore } from "../route"

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()
    if (typeof productId !== "number") {
      return NextResponse.json({ success: false, error: "Invalid productId" }, { status: 400 })
    }
    wishlistStore.add(productId)
    return NextResponse.json({ success: true, total: wishlistStore.size })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 })
  }
}
