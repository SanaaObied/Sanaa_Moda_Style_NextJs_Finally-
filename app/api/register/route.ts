import { type NextRequest, NextResponse } from "next/server"

// Mock user database (replace with real database)
const users: any[] = []

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ""))
}

function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      telNo,
      Address,
      city,
      postalCode,
      country,
      agreeToTerms,
      subscribeNewsletter,
    } = body

    // Validate required fields
    const requiredFields = { firstName, lastName, email, password, telNo, Address, city, country }
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
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          error: "Invalid email",
          message: "Please enter a valid email address",
          field: "email",
        },
        { status: 400 },
      )
    }

    // Check if email already exists
    const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already exists",
          message: "An account with this email address already exists",
          field: "email",
        },
        { status: 409 },
      )
    }

    // Validate phone format
    if (!validatePhone(telNo)) {
      return NextResponse.json(
        {
          error: "Invalid phone number",
          message: "Please enter a valid phone number",
          field: "telNo",
        },
        { status: 400 },
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Weak password",
          message: "Password does not meet security requirements",
          details: passwordValidation.errors,
          field: "password",
        },
        { status: 400 },
      )
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          error: "Password mismatch",
          message: "Passwords do not match",
          field: "confirmPassword",
        },
        { status: 400 },
      )
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      return NextResponse.json(
        {
          error: "Terms not accepted",
          message: "You must agree to the terms and conditions",
          field: "agreeToTerms",
        },
        { status: 400 },
      )
    }

    // TODO: In a real application, you would:
    // 1. Hash the password with bcrypt
    // 2. Save user to database
    // 3. Send verification email
    // 4. Create user session or JWT token

    // Create new user object
    const newUser = {
      id: users.length + 1,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      // password: await bcrypt.hash(password, 12), // Hash password in real app
      telNo: telNo.trim(),
      address: Address.trim(),
      city: city.trim(),
      postalCode: postalCode?.trim() || "",
      country,
      subscribeNewsletter: subscribeNewsletter || false,
      isVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    }

    // Add to mock database
    users.push(newUser)

    // Log registration
    console.log(`✅ New user registered: ${email} at ${new Date().toISOString()}`)

    // Send welcome email (in real app)
    if (subscribeNewsletter) {
      console.log(`📧 Adding ${email} to newsletter subscription`)
    }

    // Return success response (excluding password)
    const { password: _, ...safeUserData } = newUser

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Welcome to Sonaa Moda Style!",
        user: safeUserData,
        timestamp: new Date().toISOString(),
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("❌ Registration API error:", error)

    return NextResponse.json(
      {
        error: "Server error",
        message: "An unexpected error occurred during registration. Please try again later.",
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
