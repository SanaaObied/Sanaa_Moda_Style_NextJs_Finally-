"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, ShoppingBag, Heart, Gift, Truck, Star } from "lucide-react"

interface Notification {
  id: number
  type: "order" | "wishlist" | "promotion" | "review" | "shipping"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
      }
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch("/api/notifications/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5 text-blue-500" />
      case "wishlist":
        return <Heart className="w-5 h-5 text-red-500" />
      case "promotion":
        return <Gift className="w-5 h-5 text-green-500" />
      case "shipping":
        return <Truck className="w-5 h-5 text-purple-500" />
      case "review":
        return <Star className="w-5 h-5 text-yellow-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Notifications</h1>
          <p className="text-lg text-gray-600">
            Stay updated with your latest activities
            {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount} unread</Badge>}
          </p>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50"
              disabled={unreadCount === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Bell className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-2">No Notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  notification.read ? "bg-white/70" : "bg-white/90 border-l-4 border-l-rose-500"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="text-rose-600 hover:text-rose-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className={`mb-3 ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(notification.timestamp).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-300 text-rose-600 hover:bg-rose-50"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
