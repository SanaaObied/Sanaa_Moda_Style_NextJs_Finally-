"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  ShoppingBag,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
} from "lucide-react"

export default function Home() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showReviews, setShowReviews] = useState(false)

  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState("")

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterLoading(true)
    setNewsletterMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewsletterMessage("Successfully subscribed to our newsletter!")
        setNewsletterEmail("")
      } else {
        setNewsletterMessage(data.message || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      setNewsletterMessage("An error occurred. Please try again.")
    } finally {
      setNewsletterLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "") || ""

        const url = `${base.replace(/\/$/, "")}/api/home`

        const res = await fetch(url, { cache: "no-store" })

        const contentType = res.headers.get("content-type") || ""
        if (!res.ok || !contentType.includes("application/json")) {
          const text = await res.text()
          throw new Error(`Unexpected response (${res.status}): ${text.slice(0, 100)}…`)
        }

        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading our latest collection...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 font-medium">Unable to load content. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-pink-100/50"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-rose-500 mr-3 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Sonaa Moda Style
            </h1>
            <Sparkles className="h-8 w-8 text-rose-500 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Where elegance meets contemporary fashion. Discover your unique style with our curated collection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full text-lg"
            >
              <Link href="/dresses">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Explore Collection
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full text-lg"
            >
              <Link href="/account">
                <Heart className="h-5 w-5 mr-2" />
                View Favorites
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{data.stats?.totalProducts || 150}+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{data.stats?.happyCustomers || 2500}+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{data.stats?.yearsInBusiness || 5}+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{data.stats?.averageRating || 4.8}★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">14-day return policy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Discover our latest collections</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/dresses" className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src="/images/dress.jpg"
                    fill
                    alt="Dresses Collection"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Dresses</h3>
                    <p className="text-sm">Elegant & Stylish</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/tops" className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src="/images/tops.jpg"
                    fill
                    alt="Tops Collection"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Tops</h3>
                    <p className="text-sm">Comfortable & Chic</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/new-arrivals" className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src="/images/dress2.webp"
                    fill
                    alt="New Arrivals"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">New Arrivals</h3>
                    <p className="text-sm">Latest Trends</p>
                    <Badge className="mt-2 bg-green-500">New</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">About Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center">{data.about}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{data.sectionTitle}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{data.sectionDescription}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.products.map((product: any, index: number) => (
              <Card
                key={product.name}
                className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      width={500}
                      height={600}
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        asChild
                        className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                      >
                        <Link href={`/${product.category}`}>View Collection</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{product.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">What Our Customers Say</h2>

              <div className="text-center mb-8">
                <Button
                  onClick={() => setShowReviews(!showReviews)}
                  variant="outline"
                  className="border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-3 rounded-full"
                >
                  {showReviews ? (
                    <>
                      Hide Reviews <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show Reviews <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {showReviews && (
                <div className="space-y-6 animate-in slide-in-from-top duration-500">
                  {data.reviews.map((review: any, i: number) => (
                    <Card key={i} className="border border-rose-200 bg-gradient-to-r from-white to-rose-50">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                              {review.author.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, index) => (
                                <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-gray-700 italic mb-2">"{review.message}"</p>
                            <p className="text-rose-600 font-semibold">— {review.author}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
              <p className="text-rose-100 mb-8">
                Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                />
                <Button
                  type="submit"
                  disabled={newsletterLoading}
                  className="bg-white text-rose-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium"
                >
                  {newsletterLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
              {newsletterMessage && (
                <p
                  className={`mt-4 text-sm ${newsletterMessage.includes("success") ? "text-green-200" : "text-red-200"}`}
                >
                  {newsletterMessage}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
