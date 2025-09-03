"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  ShoppingCart,
  Search,
  Filter,
  Star,
  Eye,
  Share2,
  Grid,
  List,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react"
import { useToast } from "@/components/Toast"

interface Top {
  id: number
  title: string
  image: string
  description: string
  price: string
  originalPrice?: string
  discount?: number
  ratings: string[]
  reviews: string[]
  sizes: string[]
  colors: string[]
  category: string
  isNew?: boolean
  isBestseller?: boolean
}

interface TopsClientProps {
  initialTops: Top[]
}

export default function TopsClient({ initialTops }: TopsClientProps) {
  const [tops] = useState<Top[]>(initialTops)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [filterCategory, setFilterCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTop, setSelectedTop] = useState<Top | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null)
  const { toast, ToastContainer } = useToast()

  // Enhanced filtering and sorting
  const filteredAndSortedTops = useMemo(() => {
    const filtered = tops.filter((top) => {
      const matchesSearch =
        top.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        top.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || top.category === filterCategory
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under30" && Number.parseFloat(top.price.replace("$", "")) < 30) ||
        (priceRange === "30to50" &&
          Number.parseFloat(top.price.replace("$", "")) >= 30 &&
          Number.parseFloat(top.price.replace("$", "")) <= 50) ||
        (priceRange === "over50" && Number.parseFloat(top.price.replace("$", "")) > 50)

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseFloat(a.price.replace("$", "")) - Number.parseFloat(b.price.replace("$", ""))
        case "price-high":
          return Number.parseFloat(b.price.replace("$", "")) - Number.parseFloat(a.price.replace("$", ""))
        case "name":
          return a.title.localeCompare(b.title)
        case "rating":
          return b.ratings.length - a.ratings.length
        default:
          return 0
      }
    })

    return filtered
  }, [tops, searchTerm, sortBy, filterCategory, priceRange])

  const toggleFavorite = async (id: number) => {
    try {
      const isInFavorites = favorites.includes(id)
      const endpoint = isInFavorites ? "/api/wishlist/remove" : "/api/wishlist/add"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      })

      // Only parse when response is JSON
      const isJSON = response.headers.get("content-type")?.includes("application/json")
      const data = isJSON ? await response.json() : null

      if (response.ok && data?.success) {
        setFavorites((prev) => (isInFavorites ? prev.filter((fav) => fav !== id) : [...prev, id]))
        toast.success(isInFavorites ? "Removed from wishlist" : "Added to wishlist")
      } else {
        toast.error("Failed to update wishlist")
        console.error("Wishlist API error:", data || (await response.text()))
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error)
      toast.error("Failed to update wishlist")
    }
  }

  const addToCart = async (id: number) => {
    setIsAddingToCart(id)
    try {
      const top = tops.find((t) => t.id === id)
      if (!top) {
        toast.error("Product not found")
        return
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
          size: top.sizes[0] || "M", // Default size
          color: top.colors[0] || "Default",
          type: "top",
          title: top.title,
          price: top.price,
          image: top.image,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCart((prev) => [...prev, id])
        toast.success("Added to cart successfully!")
      } else {
        toast.error("Failed to add to cart")
      }
    } catch (error) {
      console.error("Add to cart failed:", error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAddingToCart(null)
    }
  }

  // Robust share handler with graceful fallback to clipboard
  const shareProduct = async (top: Top) => {
    const url = `${window.location.origin}/product/${top.id}`

    // 1️⃣ Try the native Share API (first-class UX on supported, secure origins)
    if (navigator.share) {
      try {
        await navigator.share({ title: top.title, text: top.description, url })
        toast.success("Shared successfully!")
        return
      } catch (err: any) {
        // "Permission denied", user abort, or any other failure → continue to clipboard fallback
        console.warn("Native share failed, falling back to clipboard:", err)
      }
    }

    // 2️⃣ Clipboard fallback—works in most modern browsers and avoids the permission error
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch (clipErr) {
      console.error("Clipboard write failed:", clipErr)
      toast.error("Unable to share the product")
    }
  }

  const openProductDetails = (top: Top) => {
    setSelectedTop(top)
    setIsModalOpen(true)
  }

  const calculateAverageRating = (ratings: string[]) => {
    if (!ratings || ratings.length === 0) return 0
    const totalStars = ratings.reduce((sum, rating) => sum + rating.length, 0)
    return totalStars / ratings.length
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">Stylish Tops Collection</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover our curated selection of trendy and comfortable tops for every occasion
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search tops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <div className="flex gap-4 items-center">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Party">Party</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under30">Under $30</SelectItem>
                    <SelectItem value="30to50">$30 - $50</SelectItem>
                    <SelectItem value="over50">Over $50</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredAndSortedTops.length} of {tops.length} tops
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Cart:</span>
              <Badge variant="secondary">{cart.length}</Badge>
              <span className="text-sm text-gray-500">Favorites:</span>
              <Badge variant="secondary">{favorites.length}</Badge>
            </div>
          </div>

          {/* Products Grid/List */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredAndSortedTops.map((top) => (
              <Card
                key={top.id}
                className={`group hover:shadow-xl transition-all duration-300 ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <Image
                    src={top.image || "/placeholder.svg"}
                    alt={top.title}
                    width={viewMode === "list" ? 200 : 400}
                    height={viewMode === "list" ? 200 : 400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {top.isNew && <Badge className="bg-green-500">New</Badge>}
                    {top.isBestseller && <Badge className="bg-orange-500">Bestseller</Badge>}
                    {top.discount && <Badge className="bg-red-500">-{top.discount}%</Badge>}
                  </div>

                  {/* Quick Actions - Fixed */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(top.id)
                      }}
                      className={`${favorites.includes(top.id) ? "text-red-500 bg-red-50" : ""} hover:scale-110 transition-transform`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(top.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        openProductDetails(top)
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareProduct(top)
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(top.id)
                      }}
                      disabled={isAddingToCart === top.id}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isAddingToCart === top.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className={`p-4 flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
                  <CardHeader className="p-0 mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{top.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{top.description}</p>
                  </CardHeader>

                  <CardContent className="p-0 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">{renderStars(calculateAverageRating(top.ratings))}</div>
                      <span className="text-sm text-gray-500">({top.reviews?.length || 0})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-purple-600">{top.price}</span>
                      {top.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">{top.originalPrice}</span>
                      )}
                    </div>

                    {viewMode === "list" && (
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline">{top.category}</Badge>
                        <Badge variant="outline">{top.sizes?.join(", ")}</Badge>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-0">
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => addToCart(top.id)}
                        disabled={isAddingToCart === top.id}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isAddingToCart === top.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        Add to Cart
                      </Button>
                      <Button variant="outline" onClick={() => openProductDetails(top)} className="hover:bg-purple-50">
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedTops.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👕</div>
              <h3 className="text-2xl font-semibold mb-2">No tops found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterCategory("all")
                  setPriceRange("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal - Fixed */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTop && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTop.title}</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Image
                    src={selectedTop.image || "/placeholder.svg"}
                    alt={selectedTop.title}
                    width={500}
                    height={500}
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">{selectedTop.description}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-purple-600">{selectedTop.price}</span>
                    {selectedTop.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">{selectedTop.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">{renderStars(calculateAverageRating(selectedTop.ratings))}</div>
                    <span className="text-gray-500">({selectedTop.reviews?.length || 0} reviews)</span>
                  </div>

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Available Sizes:</h4>
                        <div className="flex gap-2">
                          {selectedTop.sizes?.map((size) => (
                            <Badge key={size} variant="outline">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Available Colors:</h4>
                        <div className="flex gap-2">
                          {selectedTop.colors?.map((color) => (
                            <Badge key={color} variant="outline">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-4">
                      {selectedTop.reviews?.map((review, idx) => (
                        <div key={idx} className="border-b pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {selectedTop.ratings[idx]?.split("").map((star, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review}</p>
                        </div>
                      )) || <p className="text-gray-500">No reviews yet</p>}
                    </TabsContent>

                    <TabsContent value="shipping" className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium">Free Shipping</p>
                          <p className="text-xs text-gray-500">On orders over $50</p>
                        </div>
                        <div>
                          <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium">Secure Payment</p>
                          <p className="text-xs text-gray-500">100% protected</p>
                        </div>
                        <div>
                          <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium">Easy Returns</p>
                          <p className="text-xs text-gray-500">30-day policy</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => addToCart(selectedTop.id)}
                      disabled={isAddingToCart === selectedTop.id}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isAddingToCart === selectedTop.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleFavorite(selectedTop.id)}
                      className={favorites.includes(selectedTop.id) ? "text-red-500 border-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(selectedTop.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" onClick={() => shareProduct(selectedTop)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </>
  )
}
