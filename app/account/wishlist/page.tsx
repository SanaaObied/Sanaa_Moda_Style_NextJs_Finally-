import WishlistClient, { WishlistItem } from "./WishlistClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wishlist Client - Sonaa Moda Style",
  description: "Edit your personal, security, and address information.",
  icons: {
    icon: "/favicon.ico",
  },
}
/*{
    id: 1,
    title: "Floral Summer Dress",
    image: "/images/dress1.webp",
    description:
      "This beautiful floral summer dress is perfect for sunny days. Made with lightweight fabric and vibrant colors that will make you stand out.",
    price: "$49.99",
    priceValue: 49.99,
    originalPrice: "$69.99",
    ratings: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
    reviews: [
      "Absolutely love this dress! So comfortable and stylish. Perfect for summer outings. - Sama",
      "The colors are even prettier in person. Great quality fabric and excellent fit. - Haneen",
      "Perfect fit and true to size. Received many compliments wearing this. - Roaa",
    ],
    averageRating: 4.3,
    reviewCount: 28,
    category: "summer",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Pink", "Floral Blue", "Floral Yellow"],
    isNew: false,
    isBestseller: true,
    isOnSale: true,
    fabric: "100% Cotton with floral print",
    care: ["Machine wash cold", "Hang dry", "Iron on low heat", "Do not bleach"],
  },
  {
    id: 2,
    title: "Elegant Evening Gown",
    image: "/images/dress2.webp",
    description:
      "Make a statement at your next special event with this elegant evening gown. Features sophisticated design and premium materials.",
    price: "$99.99",
    priceValue: 99.99,
    originalPrice: "$129.99",
    ratings: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
    reviews: [
      "Received so many compliments wearing this gown. Absolutely stunning and well-made. - Hasaan",
      "The fit is perfect, and the fabric is high quality. Worth every penny. - Zuhour",
      "Great value for such a beautiful gown. Perfect for formal events. - Afnan",
    ],
    averageRating: 4.7,
    reviewCount: 15,
    category: "evening",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald Green", "Navy Blue", "Burgundy"],
    isNew: true,
    isBestseller: false,
    isOnSale: true,
    fabric: "Polyester blend with satin finish",
    care: ["Dry clean only", "Store hanging", "Steam to remove wrinkles"],
  },*/
export default function WishlistClientPage() {
  const demoItems: WishlistItem[] = [
    {
      id: 1,
      title: "Floral Summer Dress",
      image: "/images/dress1.webp",
      price: 49.99,
      originalPrice: 59.99,
      category: "Dresses",
      rating: 4.5,
      reviewCount: 20,
      inStock: true,
      isOnSale: true,
    },
    {
      id: 2,
      title: "Elegant Top",
      image: "/images/dress2.webp",
      price: 29.99,
      category: "Tops",
      rating: 4.0,
      reviewCount: 10,
      inStock: true,
      isOnSale: false,
    },
  ]

  return <WishlistClient initialItems={demoItems} />
}
