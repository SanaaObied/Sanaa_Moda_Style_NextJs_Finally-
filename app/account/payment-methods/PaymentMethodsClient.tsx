"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Plus, Trash2, Edit, Shield, CheckCircle, AlertCircle, Calendar } from "lucide-react"

interface PaymentMethod {
  id: number
  type: "credit" | "debit" | "paypal" | "apple_pay"
  cardNumber: string
  cardHolder: string
  expiryDate: string
  isDefault: boolean
  brand: string
  lastUsed: string
}

export default function PaymentMethodsClient() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    type: "credit",
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/payment-methods")
      const data = await response.json()
      if (data.success) {
        setPaymentMethods(data.paymentMethods)
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error)
    } finally {
      setLoading(false)
    }
  }

  const addPaymentMethod = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment-methods/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      })

      const data = await response.json()
      if (data.success) {
        setPaymentMethods([...paymentMethods, data.paymentMethod])
        setNewCard({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "", type: "credit" })
        setIsAddingCard(false)
        setMessage({ type: "success", text: "Payment method added successfully!" })
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add payment method" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while adding payment method" })
    } finally {
      setLoading(false)
    }
  }

  const deletePaymentMethod = async (id: number) => {
    try {
      const response = await fetch("/api/payment-methods/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
        setMessage({ type: "success", text: "Payment method deleted successfully!" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete payment method" })
    }
  }

  const setDefaultPaymentMethod = async (id: number) => {
    try {
      const response = await fetch("/api/payment-methods/set-default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setPaymentMethods(
          paymentMethods.map((method) => ({
            ...method,
            isDefault: method.id === id,
          })),
        )
        setMessage({ type: "success", text: "Default payment method updated!" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update default payment method" })
    }
  }

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      default:
        return "💳"
    }
  }

  if (loading && paymentMethods.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Methods</h1>
          <p className="text-lg text-gray-600">Manage your payment options securely</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <Alert
            className={`mb-6 ${
              message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Payment Method */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                    <Input
                      id="cardHolder"
                      placeholder="John Doe"
                      value={newCard.cardHolder}
                      onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={newCard.expiryDate}
                        onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="type">Card Type</Label>
                    <Select value={newCard.type} onValueChange={(value) => setNewCard({ ...newCard, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={addPaymentMethod} disabled={loading} className="flex-1">
                      {loading ? "Adding..." : "Add Card"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingCard(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <CreditCard className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-2">No Payment Methods</h3>
                <p className="text-gray-600">Add a payment method to make purchases easier.</p>
              </CardContent>
            </Card>
          ) : (
            paymentMethods.map((method) => (
              <Card key={method.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                        {getCardIcon(method.brand)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">•••• •••• •••• {method.cardNumber.slice(-4)}</h3>
                          {method.isDefault && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Default</Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{method.cardHolder}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires {method.expiryDate}
                          </span>
                          <span>Last used {method.lastUsed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePaymentMethod(method.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Security Notice */}
        <Card className="mt-8 border-0 shadow-xl bg-blue-50/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Your Payment Information is Secure</h3>
                <p className="text-blue-700 text-sm">
                  We use industry-standard encryption to protect your payment information. Your card details are never
                  stored on our servers and are processed securely through our payment partners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
