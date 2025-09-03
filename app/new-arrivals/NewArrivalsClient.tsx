"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Grid3X3, List, Sparkles, TrendingUp, Clock, Tag, Eye, Search } from "lucide-react"

interface Product {
  id: number
  title: string
  image: string
  description: string
  price: number
  originalPrice?: number
  category: string
  isNew: boolean
  isBestseller: boolean
  discount?: number
  ratings: number
  reviewCount: number
  colors: string[]
  sizes: string[]
  tags: string[]
  dateAdded: string
}

interface NewArrivalsClientProps {
  products: Product[]
}

export default function NewArrivalsClient({ products }: NewArrivalsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map((p) => p.category))]
    return cats
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.ratings - a.ratings)
        break
      default:
        break
    }

    return filtered
  }, [products, searchTerm, selectedCategory, sortBy])

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const addToCart = (productId: number) => {
    setCart((prev) => [...prev, productId])
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          width={400}
          height={400}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Bestseller
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              <Tag className="w-3 h-3 mr-1" />-{product.discount}%
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart
              className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
            onClick={() => setSelectedProduct(product)}
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1">
            {renderStars(product.ratings)}
            <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {new Date(product.dateAdded).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
          {product.colors.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center text-xs">
              +{product.colors.length - 3}
            </div>
          )}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          onClick={() => addToCart(product.id)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-5xl font-bold">New Arrivals</h1>
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <p className="text-xl mb-8 opacity-90">
              Discover the latest fashion trends and styles. Fresh collections, premium quality, unbeatable prices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{products.length}+</div>
                <div className="text-sm opacity-80">New Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm opacity-80">Up to Off</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search new arrivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                  ✕
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.title}
                  width={400}
                  height={400}
                  className="w-full h-80 object-cover rounded-lg"
                />

                <div>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-green-600">${selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(selectedProduct.ratings)}
                    <span className="text-sm text-gray-500">({selectedProduct.reviewCount} reviews)</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Available Colors:</h4>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Available Sizes:</h4>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <Badge key={index} variant="outline">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => addToCart(selectedProduct.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" onClick={() => toggleWishlist(selectedProduct.id)}>
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">
            Be the first to know about new arrivals, exclusive offers, and fashion tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-purple-600 hover:bg-gray-100">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
