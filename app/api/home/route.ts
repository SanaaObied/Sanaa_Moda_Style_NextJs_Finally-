import { NextResponse } from "next/server"

export async function GET() {
  const res = NextResponse.json({
    about:
      "Welcome to Sonaa Moda Style! We offer stylish and affordable fashion for all occasions. Our carefully curated collection brings you the latest trends and timeless classics, all at prices that won't break the bank. From elegant evening wear to casual chic, we have something special for every woman who values quality and style.",
    sectionTitle: "Dress to Impress This Season",
    sectionDescription:
      "Discover our exclusive collection of elegant fashion pieces designed to make you look and feel your best. From casual chic to formal elegance, we have something for every style and occasion.",
    products: [
      {
        id: 1,
        name: "Elegant Dresses",
        description:
          "From flowing evening gowns to chic cocktail dresses, our collection features stunning pieces for every special occasion. Each dress is carefully selected for its quality, fit, and timeless appeal.",
        image: "/images/dress2.webp",
        category: "dresses",
        featured: true,
      },
      {
        id: 2,
        name: "Stylish Tops",
        description:
          "Discover our range of sophisticated blouses, trendy t-shirts, and elegant tops perfect for any wardrobe. Mix and match to create endless stylish combinations.",
        image: "/images/tops.jpg",
        category: "tops",
        featured: true,
      },
      {
        id: 3,
        name: "Premium Bottoms",
        description:
          "Complete your look with our selection of tailored pants, designer jeans, and flowing skirts. Quality fabrics and perfect fits guaranteed.",
        image: "/images/Botom.webp",
        category: "bottoms",
        featured: true,
      },
    ],
    reviews: [
      {
        id: 1,
        message:
          "Absolutely love the quality and style! The dresses are gorgeous and fit perfectly. The fabric is amazing and the designs are so elegant. Will definitely be shopping here again!",
        author: "Sarah Jones",
        rating: 5,
        date: "2024-03-15",
      },
      {
        id: 2,
        message:
          "Amazing customer service and beautiful clothes. The tops I bought are exactly what I was looking for - elegant, comfortable, and versatile. Highly recommend!",
        author: "David Miller",
        rating: 5,
        date: "2024-03-10",
      },
      {
        id: 3,
        message:
          "Great selection and affordable prices. The quality exceeded my expectations and the styles are so current. Sonaa Moda Style is now my go-to fashion destination!",
        author: "Emma Wilson",
        rating: 5,
        date: "2024-03-08",
      },
      {
        id: 4,
        message:
          "The floral tops are absolutely beautiful! Perfect fit and the colors are even more vibrant in person. Love the attention to detail in every piece.",
        author: "Maya Ahmed",
        rating: 5,
        date: "2024-03-05",
      },
    ],
    stats: {
      totalProducts: 150,
      happyCustomers: 2500,
      yearsInBusiness: 5,
      averageRating: 4.8,
    },
    featuredProducts: [
      {
        id: 1,
        name: "Emerald Evening Gown",
        price: 299.99,
        image: "/images/dress2.webp",
        rating: 4.9,
      },
      {
        id: 6,
        name: "Floral Peplum Top",
        price: 59.99,
        image: "/images/top2.jpg",
        rating: 4.7,
      },
      {
        id: 5,
        name: "Cable Knit Vest",
        price: 79.99,
        image: "/images/top1.png",
        rating: 4.8,
      },
    ],
  })

  // Set CORS headers
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", "Content-Type")

  return res
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
