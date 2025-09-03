"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Package,
  Heart,
  Settings,
  CreditCard,
  MapPin,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react"

interface UserData {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  memberSince: string
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  favoriteItems: number
}

export default function AccountDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      try {
        // In real app, this would be an API call
        const mockUserData: UserData = {
          firstName: "Sarah",
          lastName: "Ahmed",
          email: "sarah.ahmed@sonaamodastyle.com",
          avatar: "/images/avatar-placeholder.jpg",
          memberSince: "2024-01-15",
          totalOrders: 12,
          totalSpent: 1250.99,
          loyaltyPoints: 850,
          favoriteItems: 8,
        }
        setUserData(mockUserData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading your account...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg text-gray-600">Unable to load account data. Please try again.</p>
        </div>
      </div>
    )
  }

  const accountMenuItems = [
    {
      title: "Order History",
      description: "View and track your orders",
      icon: Package,
      href: "/account/order-history",
      badge: userData.totalOrders.toString(),
    },
    {
      title: "Update Profile",
      description: "Edit your personal information",
      icon: User,
      href: "/account/update-profile",
    },
    {
      title: "Change Password",
      description: "Update your account security",
      icon: Shield,
      href: "/account/change-password",
    },
    {
      title: "Wishlist",
      description: "Your saved favorite items",
      icon: Heart,
      href: "/account/wishlist",
      badge: userData.favoriteItems.toString(),
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: CreditCard,
      href: "/account/payment-methods",
    },
    {
      title: "Addresses",
      description: "Manage shipping addresses",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Notifications",
      description: "Email and SMS preferences",
      icon: Bell,
      href: "/account/notifications",
    },
    {
      title: "Account Settings",
      description: "Privacy and account preferences",
      icon: Settings,
      href: "/account/settings",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Account</h1>
          <p className="text-lg text-gray-600">Manage your orders, profile, and preferences</p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-2xl">
                  {userData.firstName.charAt(0)}
                  {userData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userData.firstName}!</h2>
                <p className="text-gray-600 mb-4">{userData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                    <Calendar className="h-3 w-3 mr-1" />
                    Member since {new Date(userData.memberSince).getFullYear()}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Star className="h-3 w-3 mr-1" />
                    VIP Customer
                  </Badge>
                </div>
              </div>

              <Button
                asChild
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              >
                <Link href="/account/update-profile">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userData.totalOrders}</h3>
              <p className="text-gray-600 text-sm">Total Orders</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">${userData.totalSpent.toFixed(2)}</h3>
              <p className="text-gray-600 text-sm">Total Spent</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userData.loyaltyPoints}</h3>
              <p className="text-gray-600 text-sm">Loyalty Points</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userData.favoriteItems}</h3>
              <p className="text-gray-600 text-sm">Wishlist Items</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Menu */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Account Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountMenuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-rose-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                            <item.icon className="h-6 w-6 text-rose-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200">{item.badge}</Badge>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50">
              <Link href="/dresses">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link href="/contact">Need Help?</Link>
            </Button>
            <Button asChild variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              <Link href="/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
