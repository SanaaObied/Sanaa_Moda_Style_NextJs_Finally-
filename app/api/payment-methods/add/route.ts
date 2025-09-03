import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cardNumber, cardHolder, expiryDate, cvv, type } = body

    // Validate required fields
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // Mock adding payment method
    const newPaymentMethod = {
      id: Date.now(),
      type,
      cardNumber,
      cardHolder,
      expiryDate,
      isDefault: false,
      brand: cardNumber.startsWith("4") ? "Visa" : "Mastercard",
      lastUsed: "Never",
    }

    return NextResponse.json({
      success: true,
      message: "Payment method added successfully",
      paymentMethod: newPaymentMethod,
    })
  } catch (error) {
    console.error("Failed to add payment method:", error)
    return NextResponse.json({ success: false, message: "Failed to add payment method" }, { status: 500 })
  }
}
