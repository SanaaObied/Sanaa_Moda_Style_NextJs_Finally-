import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    // Mock setting default
    return NextResponse.json({
      success: true,
      message: "Default payment method updated successfully",
    })
  } catch (error) {
    console.error("Failed to set default payment method:", error)
    return NextResponse.json({ success: false, message: "Failed to update default payment method" }, { status: 500 })
  }
}
