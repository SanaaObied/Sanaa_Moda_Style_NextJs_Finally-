import { type NextRequest, NextResponse } from "next/server"

// Mock user database (replace with real database)
const users = [
  {
    id: 1,
    email: "sanaobied2@gmail.com",
    password: "sana123", // In real app, this would be hashed
    firstName: "Sana",
    lastName: "Obied",
    role: "customer",
    isActive: true,
  },
  {
    id: 2,
    email: "sarah.ahmed@sonaamodastyle.com",
    password: "sarah123", // In real app, this would be hashed
    firstName: "Sarah",
    lastName: "Ahmed",
    role: "customer",
    isActive: true,
  },
]

// Password validation function
function validatePassword(password: string): boolean {
  return password.length >= 6 // Simple validation for demo
}

// Email validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
          field: !email ? "email" : "password",
        },
        { status: 400 },
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address",
          field: "email",
        },
        { status: 400 },
      )
    }

    // Validate password
    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters long",
          field: "password",
        },
        { status: 400 },
      )
    }

    // Find user in mock database
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      // Log failed login attempt
      console.log(`Failed login attempt for email: ${email} at ${new Date().toISOString()}`)

      return NextResponse.json(
        {
          error: "Invalid email or password",
          message: "Please check your credentials and try again",
        },
        { status: 401 },
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          error: "Account is deactivated",
          message: "Please contact support to reactivate your account",
        },
        { status: 403 },
      )
    }

    // TODO: In a real application, you would:
    // 1. Hash and compare passwords using bcrypt
    // 2. Generate JWT token or create session
    // 3. Set secure HTTP-only cookies
    // 4. Log successful login
    // 5. Update last login timestamp

    // Log successful login
    console.log(`Successful login for user: ${user.email} at ${new Date().toISOString()}`)

    // Create response with user data (excluding password)
    const { password: _, ...safeUserData } = user

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: safeUserData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )

    // In a real app, set secure session cookies here
    if (rememberMe) {
      // Set longer-lasting cookie for "remember me"
      response.cookies.set("remember_user", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })
    }

    // Set session cookie (in real app, this would be a JWT or session ID)
    response.cookies.set("session", `user_${user.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      {
        error: "Server error",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}

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
