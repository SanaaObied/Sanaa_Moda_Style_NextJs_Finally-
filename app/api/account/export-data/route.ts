import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Mock user data export
    const userData = {
      profile: {
        firstName: "Sarah",
        lastName: "Ahmed",
        email: "sarah.ahmed@sonaamodastyle.com",
        phone: "+972-592-845-459",
        dateJoined: "2024-01-15T10:30:00Z",
      },
      orders: [
        {
          id: "ORD-001",
          date: "2024-03-15",
          total: 89.99,
          status: "delivered",
          items: ["Summer Floral Dress", "Casual White Top"],
        },
        {
          id: "ORD-002",
          date: "2024-03-10",
          total: 129.99,
          status: "delivered",
          items: ["Evening Black Dress"],
        },
      ],
      addresses: [
        {
          type: "home",
          address: "Abu-Falah Street, Building 15, Apt 3",
          city: "Ramallah",
          country: "Palestine",
        },
      ],
      preferences: {
        language: "en",
        currency: "USD",
        notifications: {
          email: true,
          sms: false,
        },
      },
      exportDate: new Date().toISOString(),
    }

    const jsonData = JSON.stringify(userData, null, 2)

    return new NextResponse(jsonData, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=account-data.json",
      },
    })
  } catch (error) {
    console.error("Failed to export data:", error)
    return NextResponse.json({ success: false, message: "Failed to export data" }, { status: 500 })
  }
}
