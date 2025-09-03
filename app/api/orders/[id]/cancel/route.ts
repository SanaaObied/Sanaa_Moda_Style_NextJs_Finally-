import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { reason } = await request.json()
    const orderId = params.id

    // Simulate cancellation process
    console.log(`Cancelling order ${orderId} with reason: ${reason}`)

    // In a real app, you would:
    // 1. Update order status in database
    // 2. Process refund
    // 3. Send cancellation email
    // 4. Update inventory

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      orderId,
      reason,
    })
  } catch (error) {
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 })
  }
}
