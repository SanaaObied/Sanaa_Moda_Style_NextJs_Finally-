import { NextResponse } from "next/server"

export async function GET() {
  try {
    const policyData = {
      lastUpdated: "March 30, 2024",
      sections: [
        {
          title: "Return and Refund Policy",
          type: "paragraph",
          content:
            "We want you to love what you ordered, but if something isn't right, let us know. Our return policy is designed to ensure your satisfaction and peace of mind. We believe in providing exceptional customer service and making the return process as smooth as possible.",
        },
        {
          title: "1. Return Period",
          type: "paragraph",
          content:
            "Items can be returned within 14 days of receiving your order. This gives you plenty of time to try on your items and ensure they meet your expectations. Returns outside this period will not be accepted unless there are exceptional circumstances.",
        },
        {
          title: "2. Conditions for Return",
          type: "unordered-list",
          items: [
            "Items must be in original condition: unworn, unwashed, and with tags still attached.",
            "Returns must be accompanied by the original receipt or proof of purchase.",
            "Final sale and clearance items are not eligible for return.",
            "Items must be returned in their original packaging when possible.",
            "Custom or personalized items cannot be returned unless defective.",
            "Undergarments and swimwear cannot be returned for hygiene reasons.",
          ],
        },
        {
          title: "3. How to Return",
          type: "ordered-list",
          items: [
            "Email us at sonnaamodastyle@gmail.com to request a return authorization.",
            "Include your order number, reason for return, and photos if the item is defective.",
            "We will provide you with a return authorization number and shipping instructions.",
            "Package the item securely with the return authorization number clearly visible.",
            "Ship the item back to the address provided in our response using a trackable shipping method.",
            "Keep your shipping receipt until your return is processed.",
          ],
        },
        {
          title: "4. Refunds",
          type: "paragraph",
          content:
            "Once your return is received and inspected, we will notify you of the approval or rejection of your refund within 2-3 business days. If approved, your refund will be processed to your original payment method within 7–10 business days. Please note that it may take additional time for your bank or credit card company to process the refund.",
        },
        {
          title: "5. Exchanges",
          type: "paragraph",
          content:
            "We currently do not offer direct exchanges due to inventory management. If you need a different size or style, please return the item following our return process and place a new order for the desired item. This ensures you get exactly what you want and helps us maintain accurate inventory levels.",
        },
        {
          title: "6. Shipping Costs",
          type: "paragraph",
          content:
            "Customers are responsible for return shipping costs unless the item was defective, damaged during shipping, or the wrong item was sent. We recommend using a trackable shipping service and purchasing shipping insurance for valuable items. Return shipping costs are non-refundable.",
        },
        {
          title: "7. Damaged or Defective Items",
          type: "paragraph",
          content:
            "If you receive a damaged or defective item, please contact us immediately with photos of the issue. We will provide a prepaid return label and expedite the refund or replacement process. Your satisfaction is our priority, and we will make it right.",
        },
        {
          title: "8. Contact Us",
          type: "email",
          email: "sonnaamodastyle@gmail.com",
        },
      ],
    }

    return NextResponse.json(policyData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error in return policy API:", error)
    return NextResponse.json({ error: "Failed to fetch return policy data" }, { status: 500 })
  }
}
