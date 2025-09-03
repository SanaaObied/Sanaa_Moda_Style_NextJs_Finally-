import { NextResponse } from "next/server"

const topsData = [
  {
    id: 1,
    title: "Striped Knit Top",
    image: "/images/top1.png",
    description:
      "Stay cozy and chic in this striped knit top. Perfect for layering or wearing on its own, it's a versatile addition to your wardrobe.",
    price: "$29.99",
    originalPrice: "$39.99",
    discount: 25,
    ratings: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
    reviews: [
      "Love this top! So comfy and stylish. - Soma",
      "Great quality and fits perfectly. - Jaber",
      "The colors are even prettier in person. Highly recommend. - Suha",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Navy/White", "Black/White", "Pink/White"],
    category: "Casual",
    isNew: true,
    isBestseller: false,
  },
  {
    id: 2,
    title: "Off-Shoulder Blouse",
    image: "/images/top2.jpg",
    description:
      "Make a statement with this off-shoulder blouse. Featuring a trendy design and soft fabric, it's perfect for both casual and dressy occasions.",
    price: "$39.99",
    originalPrice: "$49.99",
    discount: 20,
    ratings: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
    reviews: [
      "Absolutely love this blouse! Fits perfectly and looks gorgeous. - Islam",
      "Great quality and comfortable to wear. - Duha",
      "Beautiful design and excellent customer service. - Huda",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Blush Pink", "Navy"],
    category: "Formal",
    isNew: false,
    isBestseller: true,
  },
  {
    id: 3,
    title: "Cropped Tank Top",
    image: "/images/top3.png",
    description:
      "Stay cool and trendy in this cropped tank top. Pair it with high-waisted jeans or shorts for a stylish summer look.",
    price: "$19.99",
    ratings: ["⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐"],
    reviews: [
      "Love this tank top! Perfect for hot days. - Rama",
      "Comfortable and stylish, great for casual wear. - Nidal",
      "Nice fit and affordable price. - Mohammad",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Black", "Gray", "Mint Green"],
    category: "Casual",
    isNew: false,
    isBestseller: false,
  },
  {
    id: 4,
    title: "Silk Button-Up Shirt",
    image: "/images/top1.png",
    description:
      "Elegant silk button-up shirt perfect for professional settings or special occasions. Luxurious feel with a classic design.",
    price: "$59.99",
    originalPrice: "$79.99",
    discount: 25,
    ratings: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"],
    reviews: [
      "Absolutely stunning! The silk quality is amazing. - Sarah",
      "Perfect for work meetings. Very professional look. - Layla",
      "Love the fit and the fabric feels luxurious. - Nour",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Black", "Navy", "Burgundy"],
    category: "Formal",
    isNew: true,
    isBestseller: true,
  },
  {
    id: 5,
    title: "Bohemian Peasant Top",
    image: "/images/top2.jpg",
    description:
      "Free-spirited bohemian top with intricate embroidery and flowing sleeves. Perfect for festivals or casual outings.",
    price: "$34.99",
    ratings: ["⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
    reviews: [
      "Love the boho vibe! So comfortable and stylish. - Mira",
      "The embroidery details are beautiful. Great quality. - Lina",
      "Perfect for summer festivals. Gets lots of compliments. - Dina",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Terracotta", "Sage Green"],
    category: "Casual",
    isNew: false,
    isBestseller: false,
  },
  {
    id: 6,
    title: "Sequined Party Top",
    image: "/images/top3.png",
    description:
      "Dazzling sequined top that catches the light beautifully. Perfect for parties, nights out, or special celebrations.",
    price: "$45.99",
    originalPrice: "$65.99",
    discount: 30,
    ratings: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
    reviews: [
      "Absolutely gorgeous! Perfect for New Year's Eve. - Rania",
      "The sequins are well-attached and don't fall off. - Yasmin",
      "Got so many compliments wearing this! - Fatima",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Gold", "Silver", "Rose Gold", "Black"],
    category: "Party",
    isNew: true,
    isBestseller: true,
  },
]

export async function GET() {
  try {
    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json(topsData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error fetching tops data:", error)
    return NextResponse.json({ error: "Failed to fetch tops data" }, { status: 500 })
  }
}
