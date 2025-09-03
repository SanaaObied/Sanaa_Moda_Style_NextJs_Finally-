import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    // Mock setting default
    return NextResponse.json({
      success: true,
      message: "Default address updated successfully",
    })
  } catch (error) {
    console.error("Failed to set default address:", error)
    return NextResponse.json({ success: false, message: "Failed to update default address" }, { status: 500 })
  }
}
