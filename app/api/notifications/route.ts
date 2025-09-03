import { NextResponse } from "next/server"

// Mock notifications database
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and is being processed.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: "/account/orders/12345",
  },
  {
    id: 2,
    type: "promotion",
    title: "Special Offer",
    message: "Get 20% off on all dresses! Limited time offer.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    actionUrl: "/dresses",
  },
  {
    id: 3,
    type: "wishlist",
    title: "Item Back in Stock",
    message: "The Summer Floral Dress from your wishlist is now available!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: "/wishlist",
  },
  {
    id: 4,
    type: "shipping",
    title: "Order Shipped",
    message: "Your order #12344 has been shipped and will arrive in 2-3 days.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    actionUrl: "/account/orders/12344",
  },
]

export async function GET() {
  try {
    // Sort by timestamp (newest first)
    const sortedNotifications = mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return NextResponse.json({
      success: true,
      notifications: sortedNotifications,
      unreadCount: sortedNotifications.filter((n) => !n.read).length,
    })
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 })
  }
}
