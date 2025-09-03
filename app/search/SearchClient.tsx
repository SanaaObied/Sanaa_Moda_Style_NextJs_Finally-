"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Heart, ShoppingCart, Grid3X3, List } from "lucide-react"

interface SearchResult {
  id: number
  title: string
  image: string
  description: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  reviewCount: number
  type: "dress" | "top"
}

export default function SearchClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState<number[]>([])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results]

    // Apply filters
    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category.toLowerCase() === filterCategory.toLowerCase())
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // Keep relevance order
        break
    }

    return filtered
  }, [results, filterCategory, filterType, sortBy])

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Search Products</h1>
          <p className="text-lg text-gray-600">Find your perfect style</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for dresses, tops, or any style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 px-8"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dress">Dresses</SelectItem>
                  <SelectItem value="top">Tops</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 ml-auto">
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
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Searching...</p>
          </div>
        ) : filteredAndSortedResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">{searchQuery ? "No results found" : "Start your search"}</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No products found for "${searchQuery}". Try different keywords or filters.`
                : "Enter a search term to find products"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {filteredAndSortedResults.length} result{filteredAndSortedResults.length !== 1 ? "s" : ""}{" "}
                {searchQuery && `for "${searchQuery}"`}
              </p>
            </div>

            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {filteredAndSortedResults.map((item) => (
                <Card
                  key={item.id}
                  className={`group overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={400}
                      height={400}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                        viewMode === "list" ? "h-48" : "h-64"
                      }`}
                    />

                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className="bg-white/90">
                        {item.type === "dress" ? "Dress" : "Top"}
                      </Badge>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                        onClick={() => toggleWishlist(item.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlist.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
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

                    {viewMode === "list" && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-rose-600">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
