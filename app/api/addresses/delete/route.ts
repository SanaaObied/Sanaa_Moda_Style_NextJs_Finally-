import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    // Mock deletion
    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete address:", error)
    return NextResponse.json({ success: false, message: "Failed to delete address" }, { status: 500 })
  }
}
