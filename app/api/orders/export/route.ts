import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orders } = await request.json()

    // Create PDF content (simplified for demo)
    const pdfContent = `
      ORDER HISTORY EXPORT
      Generated on: ${new Date().toLocaleDateString()}
      
      ${orders
        .map(
          (order: any) => `
        Order #${order.id}
        Date: ${new Date(order.date).toLocaleDateString()}
        Status: ${order.status}
        Total: $${order.total.toFixed(2)}
        Items: ${order.items}
        ---
      `,
        )
        .join("\n")}
    `

    // Create blob
    const blob = new Blob([pdfContent], { type: "application/pdf" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="orders.pdf"',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
