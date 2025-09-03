import { type NextRequest, NextResponse } from "next/server"

// Enhanced mock user profile with additional fields
let userProfile = {
  firstName: "Sarah",
  lastName: "Ahmed",
  email: "sarah.ahmed@sonaamodastyle.com",
  phone: "+972-592-845-459",
  password: "", // Never store actual passwords in plain text
  address: "Abu-Falah Street, Building 15",
  city: "Ramallah",
  postalCode: "P240",
  country: "PS",
  avatar: "/images/avatar-placeholder.jpg",
  dateJoined: "2024-01-15T10:30:00Z",
  lastUpdated: "2024-03-20T14:22:00Z",
  isVerified: true,
  preferences: {
    newsletter: true,
    smsNotifications: false,
    emailNotifications: true,
  },
}

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

  if (password.length > 0) {
    // Only validate if password is provided
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
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Get user ID from session/JWT token
    // 2. Fetch user data from database
    // 3. Return sanitized user data (without password)

    const authHeader = request.headers.get("authorization")

    // Simulate authentication check
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return NextResponse.json(
    //     {
    //       error: "Unauthorized",
    //       message: "Please log in to access your profile"
    //     },
    //     { status: 401 }
    //   )
    // }

    // Return profile data without sensitive information
    const { password, ...safeProfile } = userProfile

    return NextResponse.json({
      ...safeProfile,
      password: "", // Always return empty password field
      confirmPassword: "",
    })
  } catch (error) {
    console.error("Profile fetch error:", error)

    return NextResponse.json(
      {
        error: "Server error",
        message: "Unable to fetch profile data",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, confirmPassword, address, city, postalCode, country } = body

    // Validate required fields
    const requiredFields = { firstName, lastName, email, phone }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || !value.toString().trim())
      .map(([key, _]) => key)

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: `Missing required fields: ${missingFields.join(", ")}`,
          fields: missingFields,
        },
        { status: 400 },
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Please enter a valid email address",
          field: "email",
        },
        { status: 400 },
      )
    }

    // Validate phone format
    if (!validatePhone(phone)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Please enter a valid phone number",
          field: "phone",
        },
        { status: 400 },
      )
    }

    // Validate password if provided
    if (password && password.length > 0) {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          {
            error: "Validation error",
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
            error: "Validation error",
            message: "Passwords do not match",
            field: "confirmPassword",
          },
          { status: 400 },
        )
      }
    }

    // TODO: In a real application, you would:
    // 1. Get user ID from session/JWT token
    // 2. Hash the password if it's being updated
    // 3. Update user data in database
    // 4. Log the profile update for security purposes

    // Simulate database update
    const updatedProfile = {
      ...userProfile,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address?.trim() || "",
      city: city?.trim() || "",
      postalCode: postalCode?.trim() || "",
      country: country || "",
      lastUpdated: new Date().toISOString(),
    }

    // Only update password if provided
    if (password && password.length > 0) {
      // In real implementation, hash the password:
      // updatedProfile.password = await bcrypt.hash(password, 12)
      console.log("Password would be updated (hashed) in real implementation")
    }

    userProfile = updatedProfile

    // Log security event
    console.log(`Profile updated for user: ${email} at ${new Date().toISOString()}`)

    // Return success response without sensitive data
    const { password: _, ...safeProfile } = updatedProfile

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        profile: safeProfile,
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
    console.error("Profile update error:", error)

    return NextResponse.json(
      {
        error: "Server error",
        message: "An unexpected error occurred while updating your profile",
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
