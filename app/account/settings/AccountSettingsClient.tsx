"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Bell,
  Shield,
  Mail,
  MessageSquare,
  Smartphone,
  Eye,
  CheckCircle,
  AlertCircle,
  Trash2,
  Download,
} from "lucide-react"

interface AccountSettings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    marketing: boolean
    orderUpdates: boolean
    newArrivals: boolean
  }
  privacy: {
    profileVisibility: "public" | "private"
    showPurchaseHistory: boolean
    allowDataCollection: boolean
    twoFactorAuth: boolean
  }
  preferences: {
    language: string
    currency: string
    theme: "light" | "dark" | "auto"
    timezone: string
  }
}

export default function AccountSettingsClient() {
  const [settings, setSettings] = useState<AccountSettings>({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
      orderUpdates: true,
      newArrivals: true,
    },
    privacy: {
      profileVisibility: "private",
      showPurchaseHistory: false,
      allowDataCollection: true,
      twoFactorAuth: false,
    },
    preferences: {
      language: "en",
      currency: "USD",
      theme: "light",
      timezone: "Asia/Jerusalem",
    },
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/account/settings")
      const data = await response.json()
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const updateSettings = async (section: keyof AccountSettings, key: string, value: any) => {
    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    }
    setSettings(updatedSettings)

    try {
      const response = await fetch("/api/account/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, key, value }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Settings updated successfully!" })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update settings" })
    }
  }

  const exportData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/account/export-data", {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "account-data.json"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setMessage({ type: "success", text: "Data exported successfully!" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data" })
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch("/api/account/delete", {
          method: "POST",
        })

        if (response.ok) {
          setMessage({ type: "success", text: "Account deletion request submitted" })
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete account" })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Account Settings</h1>
          <p className="text-lg text-gray-600">Manage your account preferences and privacy settings</p>
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

        {/* Settings Tabs */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Data
                </TabsTrigger>
              </TabsList>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notification Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label className="text-base font-medium">Email Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <Label className="text-base font-medium">SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => updateSettings("notifications", "sms", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-purple-600" />
                        <div>
                          <Label className="text-base font-medium">Push Notifications</Label>
                          <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSettings("notifications", "push", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                        <div>
                          <Label className="text-base font-medium">Marketing Communications</Label>
                          <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) => updateSettings("notifications", "marketing", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label className="text-base font-medium">Order Updates</Label>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.orderUpdates}
                        onCheckedChange={(checked) => updateSettings("notifications", "orderUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-rose-600" />
                        <div>
                          <Label className="text-base font-medium">New Arrivals</Label>
                          <p className="text-sm text-gray-600">Be the first to know about new products</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.newArrivals}
                        onCheckedChange={(checked) => updateSettings("notifications", "newArrivals", checked)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacy & Security</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label className="text-base font-medium">Profile Visibility</Label>
                          <p className="text-sm text-gray-600">Control who can see your profile</p>
                        </div>
                      </div>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) => updateSettings("privacy", "profileVisibility", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <Label className="text-base font-medium">Show Purchase History</Label>
                          <p className="text-sm text-gray-600">Allow others to see your purchase history</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.privacy.showPurchaseHistory}
                        onCheckedChange={(checked) => updateSettings("privacy", "showPurchaseHistory", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-purple-600" />
                        <div>
                          <Label className="text-base font-medium">Data Collection</Label>
                          <p className="text-sm text-gray-600">Allow us to collect data to improve your experience</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.privacy.allowDataCollection}
                        onCheckedChange={(checked) => updateSettings("privacy", "allowDataCollection", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-red-600" />
                        <div>
                          <Label className="text-base font-medium">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.privacy.twoFactorAuth}
                        onCheckedChange={(checked) => updateSettings("privacy", "twoFactorAuth", checked)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">General Preferences</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Language</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => updateSettings("preferences", "language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="he">עברית</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Currency</Label>
                      <Select
                        value={settings.preferences.currency}
                        onValueChange={(value) => updateSettings("preferences", "currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="ILS">ILS (₪)</SelectItem>
                          <SelectItem value="JOD">JOD (د.ا)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Theme</Label>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value) => updateSettings("preferences", "theme", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Timezone</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => updateSettings("preferences", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jerusalem">Asia/Jerusalem</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Data Management</h3>

                  <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Download className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-800 mb-2">Export Your Data</h4>
                          <p className="text-blue-700 text-sm mb-4">
                            Download a copy of all your account data including orders, preferences, and personal
                            information.
                          </p>
                          <Button
                            onClick={exportData}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {loading ? "Exporting..." : "Export Data"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Trash2 className="w-6 h-6 text-red-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                          <p className="text-red-700 text-sm mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <Button onClick={deleteAccount} variant="destructive" className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
