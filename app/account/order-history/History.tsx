"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Search,
  Filter,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

interface Order {
  id: number
  date: string
  items: string
  itemsArray: Array<{
    name: string
    quantity: number
    price: number
    image?: string
  }>
  total: number
  status: string
  trackingNumber?: string
  estimatedDelivery?: string
  shippingAddress?: string
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
}

export default function History() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Review states
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [cancelReason, setCancelReason] = useState("")

  // Loading states
  const [exportLoading, setExportLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/order-history")
        const data = await res.json()
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        console.error("Failed to load order history:", error)
        showToast("Failed to load orders", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    let filtered = [...orders]

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) || order.items.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter.toLowerCase())
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "total-desc":
          return b.total - a.total
        case "total-asc":
          return a.total - b.total
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  // Toast notification function
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  // View Details Handler
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  // Track Package Handler
  const handleTrackPackage = async (order: Order) => {
    setSelectedOrder(order)
    setShowTrackingModal(true)
  }

  // Export Handler
  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await fetch("/api/orders/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: filteredOrders }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `orders-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        showToast("Orders exported successfully!")
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      showToast("Failed to export orders", "error")
    } finally {
      setExportLoading(false)
    }
  }

  // Cancel Order Handler
  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      showToast("Please provide a cancellation reason", "error")
      return
    }

    setCancelLoading(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      })

      if (response.ok) {
        // Update order status locally
        setOrders((prev) =>
          prev.map((order) => (order.id === selectedOrder.id ? { ...order, status: "cancelled" } : order)),
        )
        setShowCancelModal(false)
        setCancelReason("")
        showToast("Order cancelled successfully!")
      } else {
        throw new Error("Cancellation failed")
      }
    } catch (error) {
      showToast("Failed to cancel order", "error")
    } finally {
      setCancelLoading(false)
    }
  }

  // Leave Review Handler
  const handleLeaveReview = async () => {
    if (!selectedOrder || !reviewText.trim()) {
      showToast("Please write a review", "error")
      return
    }

    setReviewLoading(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          review: reviewText,
          orderId: selectedOrder.id,
        }),
      })

      if (response.ok) {
        setShowReviewModal(false)
        setReviewText("")
        setRating(5)
        showToast("Review submitted successfully!")
      } else {
        throw new Error("Review submission failed")
      }
    } catch (error) {
      showToast("Failed to submit review", "error")
    } finally {
      setReviewLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading your order history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Order History</h1>
          <p className="text-lg text-gray-600">Track and manage all your past orders</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 focus:border-rose-500 focus:ring-rose-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-gray-300 focus:border-rose-500 focus:ring-rose-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="total-desc">Highest Amount</SelectItem>
                  <SelectItem value="total-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button
                variant="outline"
                className="border-rose-300 text-rose-600 hover:bg-rose-50"
                onClick={handleExport}
                disabled={exportLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                {exportLoading ? "Exporting..." : "Export"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
              <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{order.id}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">Order #{order.id}</CardTitle>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-800 mb-3">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.itemsArray ? (
                          order.itemsArray.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                                  <Package className="h-5 w-5 text-rose-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{order.items}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full border-rose-300 text-rose-600 hover:bg-rose-50"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>

                        {order.status.toLowerCase() === "shipped" && (
                          <Button
                            variant="outline"
                            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleTrackPackage(order)}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        )}

                        {order.status.toLowerCase() === "delivered" && (
                          <Button
                            variant="outline"
                            className="w-full border-green-300 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowReviewModal(true)
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Leave Review
                          </Button>
                        )}

                        {order.status.toLowerCase() === "processing" && (
                          <Button
                            variant="outline"
                            className="w-full border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowCancelModal(true)
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                      </div>

                      {order.trackingNumber && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-medium text-blue-800 mb-1">Tracking Number</p>
                          <p className="text-sm font-mono text-blue-700">{order.trackingNumber}</p>
                        </div>
                      )}

                      {order.estimatedDelivery && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-xs font-medium text-yellow-800 mb-1">Estimated Delivery</p>
                          <p className="text-sm text-yellow-700">{formatDate(order.estimatedDelivery)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <Card className="mt-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{filteredOrders.length}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ${filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredOrders.filter((order) => order.status.toLowerCase() === "delivered").length}
                  </p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Average Order</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">Order Details #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Order Date:</span> {formatDate(selectedOrder.date)}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</Badge>
                      </p>
                      <p>
                        <span className="font-medium">Total Amount:</span> ${selectedOrder.total.toFixed(2)}
                      </p>
                      {selectedOrder.trackingNumber && (
                        <p>
                          <span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedOrder.shippingAddress || "123 Main St, City, State 12345"}
                      </p>
                      <p className="flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedOrder.customerInfo?.phone || "+1 (555) 123-4567"}
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedOrder.customerInfo?.email || "customer@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {selectedOrder.itemsArray?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-rose-100 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-rose-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Track Package Modal */}
        <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Track Package #{selectedOrder?.trackingNumber}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Package is on the way!</h3>
                  <p className="text-gray-600">
                    Expected delivery: {formatDate(selectedOrder.estimatedDelivery || selectedOrder.date)}
                  </p>
                </div>

                {/* Tracking Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">Order Confirmed</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedOrder.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">Package Shipped</p>
                      <p className="text-sm text-gray-600">In transit to your location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-400">Out for Delivery</p>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-400">Delivered</p>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Leave Review Modal */}
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">Leave a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this order..."
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleLeaveReview}
                disabled={reviewLoading || !reviewText.trim()}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Order Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">Cancel Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">Are you sure you want to cancel order #{selectedOrder?.id}?</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation</label>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling this order..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
                  Keep Order
                </Button>
                <Button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading || !cancelReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Order"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
