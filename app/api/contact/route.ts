import { type NextRequest, NextResponse } from "next/server"

// Contact form submission interface
interface ContactFormData {
  senderName: string
  senderEmail: string
  senderLocation: string
  messageSubject: string
  messageBody: string
  inquiryType: string
  phoneNumber?: string
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ""))
}

// Mock database to store contact messages
const contactMessages: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderName, senderEmail, senderLocation, messageSubject, messageBody, inquiryType, phoneNumber } = body

    // Validate required fields
    const requiredFields = { senderName, senderEmail, messageSubject, messageBody, inquiryType }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || !value.toString().trim())
      .map(([key, _]) => key)

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: `Please fill in all required fields: ${missingFields.join(", ")}`,
          fields: missingFields,
        },
        { status: 400 },
      )
    }

    // Validate email format
    if (!validateEmail(senderEmail)) {
      return NextResponse.json(
        {
          error: "Invalid email",
          message: "Please enter a valid email address",
          field: "senderEmail",
        },
        { status: 400 },
      )
    }

    // Validate phone number if provided
    if (phoneNumber && !validatePhone(phoneNumber)) {
      return NextResponse.json(
        {
          error: "Invalid phone number",
          message: "Please enter a valid phone number",
          field: "phoneNumber",
        },
        { status: 400 },
      )
    }

    // Validate message length
    if (messageBody.length < 10) {
      return NextResponse.json(
        {
          error: "Message too short",
          message: "Message must be at least 10 characters long",
          field: "messageBody",
        },
        { status: 400 },
      )
    }

    // Create contact message object
    const contactMessage = {
      id: contactMessages.length + 1,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim().toLowerCase(),
      senderLocation: senderLocation?.trim() || "",
      phoneNumber: phoneNumber?.trim() || "",
      messageSubject: messageSubject.trim(),
      messageBody: messageBody.trim(),
      inquiryType,
      status: "new",
      priority: inquiryType === "complaint" ? "high" : inquiryType === "order" ? "medium" : "normal",
      createdAt: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    // Add to mock database
    contactMessages.push(contactMessage)

    // Log the contact form submission
    console.log(`📧 New contact form submission:`)
    console.log(`   From: ${senderName} (${senderEmail})`)
    console.log(`   Type: ${inquiryType}`)
    console.log(`   Subject: ${messageSubject}`)
    console.log(`   Time: ${new Date().toISOString()}`)

    // TODO: In a real application, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send auto-reply email to customer
    // 4. Create ticket in support system
    // 5. Send SMS notification for urgent inquiries

    // Simulate email sending
    console.log(`✅ Auto-reply email would be sent to: ${senderEmail}`)
    console.log(`📨 Admin notification would be sent for ${inquiryType} inquiry`)

    // Set response time based on inquiry type
    let expectedResponseTime = "24 hours"
    if (inquiryType === "order") {
      expectedResponseTime = "4-6 hours"
    } else if (inquiryType === "complaint") {
      expectedResponseTime = "2 hours"
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        ticketId: `SM${contactMessage.id.toString().padStart(6, "0")}`,
        expectedResponseTime,
        inquiryType,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("❌ Contact form API error:", error)

    return NextResponse.json(
      {
        error: "Server error",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

// GET endpoint to retrieve contact messages (for admin panel)
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd check admin authentication here
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredMessages = [...contactMessages]

    if (status) {
      filteredMessages = filteredMessages.filter((msg) => msg.status === status)
    }

    if (type) {
      filteredMessages = filteredMessages.filter((msg) => msg.inquiryType === type)
    }

    // Sort by creation date (newest first)
    filteredMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      messages: filteredMessages,
      total: filteredMessages.length,
      stats: {
        total: contactMessages.length,
        new: contactMessages.filter((msg) => msg.status === "new").length,
        inProgress: contactMessages.filter((msg) => msg.status === "in_progress").length,
        resolved: contactMessages.filter((msg) => msg.status === "resolved").length,
      },
    })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json(
      {
        error: "Server error",
        message: "Unable to fetch contact messages",
      },
      { status: 500 },
    )
  }
}
