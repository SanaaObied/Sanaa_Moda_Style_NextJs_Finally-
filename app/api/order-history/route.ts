import { NextResponse } from "next/server"

export async function GET() {
  const mockOrders = [
    {
      id: 1001,
      date: "2024-03-25",
      items: "2x Floral Dress, 1x Black Top",
      itemsArray: [
        {
          name: "Elegant Floral Dress",
          quantity: 2,
          price: 89.99,
          image: "/images/dress1.jpg",
        },
        {
          name: "Classic Black Top",
          quantity: 1,
          price: 45.99,
          image: "/images/top1.jpg",
        },
      ],
      total: 225.97,
      status: "Shipped",
      trackingNumber: "SM2024032501",
      estimatedDelivery: "2024-04-02",
    },
    {
      id: 1002,
      date: "2024-04-10",
      items: "1x Summer Dress",
      itemsArray: [
        {
          name: "Casual Summer Dress",
          quantity: 1,
          price: 75.0,
          image: "/images/dress2.jpg",
        },
      ],
      total: 75.0,
      status: "Delivered",
      trackingNumber: "SM2024041001",
      estimatedDelivery: "2024-04-15",
    },
    {
      id: 1003,
      date: "2024-04-28",
      items: "1x White Blouse, 1x Designer Jeans",
      itemsArray: [
        {
          name: "Premium White Blouse",
          quantity: 1,
          price: 65.0,
          image: "/images/blouse1.jpg",
        },
        {
          name: "Designer Denim Jeans",
          quantity: 1,
          price: 120.0,
          image: "/images/jeans1.jpg",
        },
      ],
      total: 185.0,
      status: "Processing",
    },
    {
      id: 1004,
      date: "2024-05-05",
      items: "1x Evening Gown",
      itemsArray: [
        {
          name: "Luxury Evening Gown",
          quantity: 1,
          price: 299.99,
          image: "/images/gown1.jpg",
        },
      ],
      total: 299.99,
      status: "Shipped",
      trackingNumber: "SM2024050501",
      estimatedDelivery: "2024-05-12",
    },
    {
      id: 1005,
      date: "2024-02-14",
      items: "1x Valentine's Special Dress",
      itemsArray: [
        {
          name: "Red Valentine Dress",
          quantity: 1,
          price: 149.99,
          image: "/images/valentine-dress.jpg",
        },
      ],
      total: 149.99,
      status: "Delivered",
      trackingNumber: "SM2024021401",
    },
  ]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json(mockOrders, {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
