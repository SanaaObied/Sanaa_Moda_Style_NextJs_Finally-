"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react"
import { toast } from "react-hot-toast"

interface Dress {
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
}

export default function DressesClient() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [filteredDresses, setFilteredDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreProducts, setHasMoreProducts] = useState(true)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const [quickAddDress, setQuickAddDress] = useState<Dress | null>(null)
  const [quickAddSize, setQuickAddSize] = useState("")
  const [quickAddLoading, setQuickAddLoading] = useState(false)

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const response = await fetch("/api/dresses")
        const data = await response.json()
        setDresses(data)
        setFilteredDresses(data)
      } catch (error) {
        console.error("Failed to load dresses", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDresses()
  }, [])

  useEffect(() => {
    let filtered = [...dresses]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dress) =>
          dress.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dress.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Price filter
    filtered = filtered.filter((dress) => dress.priceValue >= priceRange[0] && dress.priceValue <= priceRange[1])

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dress) => dress.category === selectedCategory)
    }

    // Size filter
    if (selectedSize !== "all") {
      filtered = filtered.filter((dress) => dress.sizes.includes(selectedSize))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.priceValue - b.priceValue
        case "price-high":
          return b.priceValue - a.priceValue
        case "rating":
          return b.averageRating - a.averageRating
        case "newest":
          return b.isNew ? 1 : -1
        case "bestseller":
          return b.isBestseller ? 1 : -1
        default:
          return 0
      }
    })

    setFilteredDresses(filtered)
  }, [dresses, searchTerm, sortBy, priceRange, selectedCategory, selectedSize])

  const addToCart = async (dressId: number, size = "M", showToast = true) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: dressId,
          quantity: 1,
          size,
          type: "dress",
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCartCount((prev) => prev + 1)
        if (showToast) {
          toast.success("Added to cart successfully!")
        }
        return true
      } else {
        if (showToast) {
          toast.error(data.message || "Failed to add to cart")
        }
        return false
      }
    } catch (error) {
      console.error("Add to cart failed:", error)
      if (showToast) {
        toast.error("Failed to add to cart")
      }
      return false
    }
  }

  const handleQuickAdd = async (dress: Dress) => {
    if (dress.sizes.length === 1) {
      // إذا كان هناك مقاس واحد فقط، أضف مباشرة
      const success = await addToCart(dress.id, dress.sizes[0])
      if (success) {
        toast.success(`${dress.title} added to cart!`)
      }
    } else {
      // إذا كان هناك عدة مقاسات، اعرض modal للاختيار
      setQuickAddDress(dress)
      setQuickAddSize(dress.sizes[0] || "")
    }
  }

  const confirmQuickAdd = async () => {
    if (!quickAddDress || !quickAddSize) return

    setQuickAddLoading(true)
    const success = await addToCart(quickAddDress.id, quickAddSize)

    if (success) {
      toast.success(`${quickAddDress.title} (${quickAddSize}) added to cart!`)
      setQuickAddDress(null)
      setQuickAddSize("")
    }
    setQuickAddLoading(false)
  }

  const toggleWishlist = async (dressId: number) => {
    try {
      const isInWishlist = wishlist.includes(dressId)
      const endpoint = isInWishlist ? "/api/wishlist/remove" : "/api/wishlist/add"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: dressId, type: "dress" }),
      })

      const data = await response.json()
      if (data.success) {
        setWishlist((prev) => (isInWishlist ? prev.filter((id) => id !== dressId) : [...prev, dressId]))
        toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error)
      toast.error("Failed to update wishlist")
    }
  }

  const loadMoreDresses = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/dresses?page=${currentPage + 1}&limit=12`)
      const data = await response.json()

      if (data.success && data.dresses.length > 0) {
        setDresses((prev) => [...prev, ...data.dresses])
        setCurrentPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Load more failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const categories = ["all", "casual", "formal", "evening", "summer", "winter"]
  const sizes = ["all", "XS", "S", "M", "L", "XL", "XXL"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading our beautiful dresses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-rose-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Elegant Dresses</h1>
            <Sparkles className="h-8 w-8 text-rose-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our stunning collection of dresses for every occasion
          </p>
        </div>

        {/* Search and Filters Bar */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search dresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="bestseller">Best Sellers</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-rose-300 text-rose-600 hover:bg-rose-50"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size === "all" ? "All Sizes" : size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSortBy("featured")
                        setPriceRange([0, 200])
                        setSelectedCategory("all")
                        setSelectedSize("all")
                      }}
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredDresses.length} of {dresses.length} dresses
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              Grid
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
          </div>
        </div>

        {/* Dresses Grid/List */}
        {filteredDresses.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No dresses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedSize("all")
                  setPriceRange([0, 200])
                }}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredDresses.map((dress) => (
              <Card
                key={dress.id}
                className={`group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                    <Image
                      src={dress.image || "/placeholder.svg"}
                      alt={dress.title}
                      width={400}
                      height={500}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                        viewMode === "list" ? "h-64" : "h-80"
                      }`}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {dress.isNew && (
                        <Badge className="bg-green-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      )}
                      {dress.isBestseller && (
                        <Badge className="bg-purple-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Bestseller
                        </Badge>
                      )}
                      {dress.isOnSale && (
                        <Badge className="bg-red-500 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Sale
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-10 h-10 p-0 rounded-full"
                        onClick={() => toggleWishlist(dress.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${wishlist.includes(dress.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-10 h-10 p-0 rounded-full"
                            onClick={() => setSelectedDress(dress)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{dress.title}</DialogTitle>
                            <DialogDescription>Product Details</DialogDescription>
                          </DialogHeader>
                          {selectedDress && (
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <Image
                                  src={selectedDress.image || "/placeholder.svg"}
                                  alt={selectedDress.title}
                                  width={500}
                                  height={600}
                                  className="w-full rounded-lg"
                                />
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-2xl font-bold">{selectedDress.title}</h3>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex">{renderStars(selectedDress.averageRating)}</div>
                                    <span className="text-sm text-gray-600">({selectedDress.reviewCount} reviews)</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-3xl font-bold text-rose-600">{selectedDress.price}</span>
                                  {selectedDress.originalPrice && (
                                    <span className="text-lg text-gray-500 line-through">
                                      {selectedDress.originalPrice}
                                    </span>
                                  )}
                                </div>

                                <p className="text-gray-600">{selectedDress.description}</p>

                                <div>
                                  <h4 className="font-semibold mb-2">Available Sizes:</h4>
                                  <div className="flex gap-2">
                                    {selectedDress.sizes.map((size) => (
                                      <Badge key={size} variant="outline">
                                        {size}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Available Colors:</h4>
                                  <div className="flex gap-2">
                                    {selectedDress.colors.map((color) => (
                                      <Badge key={color} variant="outline">
                                        {color}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Fabric & Care:</h4>
                                  <p className="text-sm text-gray-600 mb-2">{selectedDress.fabric}</p>
                                  <ul className="text-sm text-gray-600">
                                    {selectedDress.care.map((instruction, index) => (
                                      <li key={index}>• {instruction}</li>
                                    ))}
                                  </ul>
                                </div>

                                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        className="w-full bg-white/90 text-gray-900 hover:bg-white"
                        onClick={() => handleQuickAdd(dress)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Quick Add
                      </Button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {dress.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="flex">{renderStars(dress.averageRating)}</div>
                        <span className="text-sm text-gray-600">({dress.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{dress.title}</h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dress.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-rose-600">{dress.price}</span>
                        {dress.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{dress.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="flex gap-1 mb-4">
                      {dress.sizes.slice(0, 4).map((size) => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                      {dress.sizes.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{dress.sizes.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Reviews Preview */}
                    {viewMode === "list" && dress.reviews.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-sm mb-2">Recent Review:</h4>
                        <p className="text-sm text-gray-600 italic">"{dress.reviews[0]}"</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredDresses.length > 0 && hasMoreProducts && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-rose-300 text-rose-600 hover:bg-rose-50"
              onClick={loadMoreDresses}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More Dresses"}
            </Button>
          </div>
        )}

        {/* Quick Add Modal */}
        {quickAddDress && (
          <Dialog open={!!quickAddDress} onOpenChange={() => setQuickAddDress(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Quick Add to Cart</DialogTitle>
                <DialogDescription>Select size for {quickAddDress.title}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={quickAddDress.image || "/placeholder.svg"}
                    alt={quickAddDress.title}
                    width={80}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{quickAddDress.title}</h3>
                    <p className="text-rose-600 font-bold">{quickAddDress.price}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Select Size:</label>
                  <Select value={quickAddSize} onValueChange={setQuickAddSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      {quickAddDress.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setQuickAddDress(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmQuickAdd}
                    disabled={!quickAddSize || quickAddLoading}
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                  >
                    {quickAddLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
