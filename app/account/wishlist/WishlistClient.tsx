"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share2, Star, ArrowLeft } from "lucide-react"

interface WishlistItem {
  id: number
  title: string
  image: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  isOnSale: boolean
}

interface WishlistClientProps {
  initialItems: WishlistItem[]
}

export default function WishlistClient({ initialItems }: WishlistClientProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState(false)

  const removeFromWishlist = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/wishlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: 1 }),
      })

      if (response.ok) {
        // Optionally remove from wishlist after adding to cart
        // await removeFromWishlist(id)
        alert("Item added to cart!")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const shareItem = (item: WishlistItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this amazing ${item.title} from Sonaa Moda Style!`,
        url: window.location.origin + `/product/${item.id}`,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.origin + `/product/${item.id}`)
      alert("Link copied to clipboard!")
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
            <div className="space-y-4">
              <Link href="/dresses">
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3">
                  Explore Dresses
                </Button>
              </Link>
              <Link href="/tops">
                <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-3 ml-4">
                  Browse Tops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          <p className="text-lg text-gray-600">Your saved items ({wishlistItems.length})</p>
        </div>

        {/* Back to Shopping */}
        <div className="mb-6">
          <Link href="/dresses">
            <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {item.isOnSale && <Badge className="bg-red-500 text-white">Sale</Badge>}
                  {!item.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                    onClick={() => shareItem(item)}
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {renderStars(item.rating)}
                    <span className="text-sm text-gray-500 ml-1">({item.reviewCount})</span>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-rose-600">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                    onClick={() => addToCart(item.id)}
                    disabled={!item.inStock || isLoading}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={isLoading}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">You Might Also Like</CardTitle>
              <p className="text-gray-600">Based on your wishlist preferences</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <Link href="/new-arrivals">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
                    Explore New Arrivals
                  </Button>
                </Link>
                <Link href="/dresses">
                  <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-3 ml-4">
                    Browse All Dresses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
