import { NextResponse } from "next/server"

// Mock addresses database
const mockAddresses = [
  {
    id: 1,
    type: "home",
    firstName: "Sarah",
    lastName: "Ahmed",
    address: "Abu-Falah Street, Building 15, Apt 3",
    city: "Ramallah",
    state: "West Bank",
    postalCode: "P240",
    country: "PS",
    phone: "+972-592-845-459",
    isDefault: true,
  },
  {
    id: 2,
    type: "work",
    firstName: "Sarah",
    lastName: "Ahmed",
    company: "Tech Solutions Ltd",
    address: "Al-Irsal Street, Office Complex 7",
    city: "Ramallah",
    state: "West Bank",
    postalCode: "P241",
    country: "PS",
    phone: "+972-592-845-459",
    isDefault: false,
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      addresses: mockAddresses,
    })
  } catch (error) {
    console.error("Failed to fetch addresses:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch addresses" }, { status: 500 })
  }
}
