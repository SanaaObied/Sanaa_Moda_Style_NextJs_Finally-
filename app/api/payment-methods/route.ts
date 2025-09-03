import { NextResponse } from "next/server"

// Mock payment methods database
const mockPaymentMethods = [
  {
    id: 1,
    type: "credit",
    cardNumber: "4532123456789012",
    cardHolder: "Sarah Ahmed",
    expiryDate: "12/26",
    isDefault: true,
    brand: "Visa",
    lastUsed: "2 days ago",
  },
  {
    id: 2,
    type: "debit",
    cardNumber: "5555444433332222",
    cardHolder: "Sarah Ahmed",
    expiryDate: "08/25",
    isDefault: false,
    brand: "Mastercard",
    lastUsed: "1 week ago",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      paymentMethods: mockPaymentMethods,
    })
  } catch (error) {
    console.error("Failed to fetch payment methods:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch payment methods" }, { status: 500 })
  }
}
