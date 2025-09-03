import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    // In a real app, you would delete from the database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Notification deleted",
    })
  } catch (error) {
    console.error("Failed to delete notification:", error)
    return NextResponse.json({ success: false, message: "Failed to delete notification" }, { status: 500 })
  }
}
