"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { useToast } from "@/components/Toast"

interface Product {
  id: number
  title: string
  image: string
  description: string
  price: string
  priceValue: number
  originalPrice?: string
  ratings: string[]
  reviews: string[]
  averageRating: number
  reviewCount: number
  category: string
  sizes: string[]
  colors: string[]
  isNew: boolean
  isBestseller: boolean
  isOnSale: boolean
  fabric: string
  care: string[]
  type: "dress" | "top"
}

interface ProductDetailClientProps {
  productId: number
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { toast, ToastContainer } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/product/${productId}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.product)
        setSelectedSize(data.product.sizes[0] || "")
        setSelectedColor(data.product.colors[0] || "")
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          quantity,
          size: selectedSize,
          color: selectedColor,
          type: product?.type,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Added to cart successfully!")
      } else {
        toast.error("Failed to add to cart")
      }
    } catch (error) {
      console.error("Add to cart failed:", error)
      toast.error("Failed to add to cart")
    }
  }

  const toggleWishlist = async () => {
    try {
      const endpoint = isInWishlist ? "/api/wishlist/remove" : "/api/wishlist/add"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id, type: product?.type }),
      })

      const data = await response.json()
      if (data.success) {
        setIsInWishlist(!isInWishlist)
        toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error)
      toast.error("Failed to update wishlist")
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={600}
                    height={800}
                    className="w-full h-[600px] object-cover"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.isNew && <Badge className="bg-green-500">New</Badge>}
                  {product.isBestseller && <Badge className="bg-purple-500">Bestseller</Badge>}
                  {product.isOnSale && <Badge className="bg-red-500">Sale</Badge>}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(product.averageRating)}</div>
                  <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-rose-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-semibold mb-3">Color</h3>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={addToCart}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 h-12 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={toggleWishlist}
                    className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? "fill-current" : ""}`} />
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>

                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% protected</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day policy</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Fabric:</span> {product.fabric}
                  </p>
                  <div>
                    <span className="font-medium">Care Instructions:</span>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {product.care.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
