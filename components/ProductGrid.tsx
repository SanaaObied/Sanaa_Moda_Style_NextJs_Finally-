"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  featured: boolean
  colors: string[]
  sizes: string[]
}

interface ProductGridProps {
  category?: string
  limit?: number
  featured?: boolean
}

export default function ProductGrid({ category = "all", limit, featured = false }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams()
        if (category !== "all") params.append("category", category)
        if (limit) params.append("limit", limit.toString())
        if (featured) params.append("featured", "true")

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()

        if (data.success) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, limit, featured])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={500}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && <Badge className="bg-rose-500 text-white">Featured</Badge>}
                {product.originalPrice && (
                  <Badge className="bg-green-500 text-white">
                    Save ${(product.originalPrice - product.price).toFixed(0)}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Quick Add Button */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button className="w-full bg-white/90 text-gray-900 hover:bg-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>

                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: color.toLowerCase().includes("floral") ? "#f3f4f6" : color.toLowerCase(),
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
