import { NextResponse } from "next/server"

export async function GET() {
  // For now, mock settings
  const mockSettings = {
    email: true,
    sms: false,
    push: true,
    marketing: false,
    orderUpdates: true,
    newArrivals: false,
  }

  return NextResponse.json({
    success: true,
    settings: mockSettings,
  })
}
