import { type NextRequest, NextResponse } from "next/server"

// Mock newsletter subscribers database
const subscribers: { email: string; subscribedAt: Date }[] = []

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address" }, { status: 400 })
    }

    // Check if already subscribed
    const existingSubscriber = subscribers.find((sub) => sub.email.toLowerCase() === email.toLowerCase())
    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed to our newsletter" },
        { status: 409 },
      )
    }

    // Add to subscribers
    subscribers.push({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
    })

    // In a real app, you would:
    // 1. Save to database
    // 2. Send welcome email
    // 3. Add to email marketing service (Mailchimp, SendGrid, etc.)

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
      data: {
        email,
        subscribedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  // Admin endpoint to view subscribers
  return NextResponse.json({
    success: true,
    data: {
      totalSubscribers: subscribers.length,
      subscribers: subscribers.map((sub) => ({
        email: sub.email,
        subscribedAt: sub.subscribedAt,
      })),
    },
  })
}
