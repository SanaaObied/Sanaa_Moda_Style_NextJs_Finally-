import { NextResponse } from "next/server"

// Mock settings database
const mockSettings = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    marketing: false,
    orderUpdates: true,
    newArrivals: true,
  },
  privacy: {
    profileVisibility: "private",
    showPurchaseHistory: false,
    allowDataCollection: true,
    twoFactorAuth: false,
  },
  preferences: {
    language: "en",
    currency: "USD",
    theme: "light",
    timezone: "Asia/Jerusalem",
  },
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: mockSettings,
    })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch settings" }, { status: 500 })
  }
}
