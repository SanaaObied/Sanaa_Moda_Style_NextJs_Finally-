import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    // Mock deletion
    return NextResponse.json({
      success: true,
      message: "Payment method deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete payment method:", error)
    return NextResponse.json({ success: false, message: "Failed to delete payment method" }, { status: 500 })
  }
}
