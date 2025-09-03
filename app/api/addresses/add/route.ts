import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, firstName, lastName, company, address, city, state, postalCode, country, phone } = body

    // Validate required fields
    if (!firstName || !lastName || !address || !city || !postalCode || !phone) {
      return NextResponse.json({ success: false, message: "Required fields are missing" }, { status: 400 })
    }

    // Mock adding address
    const newAddress = {
      id: Date.now(),
      type,
      firstName,
      lastName,
      company,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: false,
    }

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    })
  } catch (error) {
    console.error("Failed to add address:", error)
    return NextResponse.json({ success: false, message: "Failed to add address" }, { status: 500 })
  }
}
