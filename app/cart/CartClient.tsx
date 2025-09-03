"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Heart, ArrowLeft, CreditCard, Truck, Shield, Gift, Tag } from "lucide-react"

interface CartItem {
  id: number
  title: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  size?: string
  color?: string
  category: string
  inStock: boolean
}

interface CartClientProps {
  initialItems: CartItem[]
}

export default function CartClient({ initialItems }: CartClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity }),
      })

      if (response.ok) {
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const moveToWishlist = async (id: number) => {
    try {
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await removeItem(id)
      }
    } catch (error) {
      console.error("Failed to move to wishlist:", error)
    }
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })

      const data = await response.json()
      if (response.ok) {
        setDiscount(data.discount)
      } else {
        alert(data.message || "Invalid promo code")
      }
    } catch (error) {
      console.error("Failed to apply promo code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = (subtotal - discountAmount) * 0.08
  const total = subtotal - discountAmount + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <div className="space-y-4">
              <Link href="/dresses">
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3">
                  Shop Dresses
                </Button>
              </Link>
              <Link href="/tops">
                <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-3 ml-4">
                  Shop Tops
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-lg text-gray-600">Review your items and proceed to checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {(item.size || item.color) && (
                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-rose-600">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isLoading}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveToWishlist(item.id)}
                            className="border-rose-300 text-rose-600 hover:bg-rose-50"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {!item.inStock && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="flex justify-between items-center">
              <Link href="/dresses">
                <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={applyPromoCode} disabled={isLoading}>
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <div className="mt-2 text-green-600 text-sm">
                    <Gift className="w-4 h-4 inline mr-1" />
                    {discount}% discount applied!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs text-gray-600">
                  <div className="flex flex-col items-center">
                    <Shield className="w-6 h-6 text-green-500 mb-1" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-6 h-6 text-blue-500 mb-1" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Heart className="w-6 h-6 text-red-500 mb-1" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
