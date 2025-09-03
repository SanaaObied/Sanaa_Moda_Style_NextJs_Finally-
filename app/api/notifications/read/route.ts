import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    // In a real app, you would update the database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return NextResponse.json({ success: false, message: "Failed to mark as read" }, { status: 500 })
  }
}
