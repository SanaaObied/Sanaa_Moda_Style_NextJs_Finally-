"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone,
  Bell,
  MessageSquare,
  Settings,
  Check,
} from "lucide-react"

interface NotificationSettingsType {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
  orderUpdates: boolean
  newArrivals: boolean
}

const defaultSettings: NotificationSettingsType = {
  email: false,
  sms: false,
  push: false,
  marketing: false,
  orderUpdates: false,
  newArrivals: false,
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>(defaultSettings)
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
const res = await fetch("/api/account/notification-settings")
      const data = await res.json()
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load notification settings" })
    }
  }

  const updateSetting = async (key: keyof NotificationSettingsType, value: boolean) => {
    const previous = settings[key]
    setSettings(prev => ({ ...prev, [key]: value }))

    try {
      const res = await fetch("/api/account/notifications/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })

      if (!res.ok) throw new Error()

      setMessage({ type: "success", text: "Setting updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update setting" })
      setSettings(prev => ({ ...prev, [key]: previous }))
    } finally {
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  const settingList = [
    {
      key: "email",
      label: "Email Notifications",
      description: "Receive updates via email.",
      icon: <Mail className="text-blue-600 h-5 w-5" />,
    },
    {
      key: "sms",
      label: "SMS Notifications",
      description: "Receive updates via text.",
      icon: <Smartphone className="text-green-600 h-5 w-5" />,
    },
    {
      key: "push",
      label: "Push Notifications",
      description: "Browser notifications.",
      icon: <Bell className="text-purple-600 h-5 w-5" />,
    },
    {
      key: "marketing",
      label: "Marketing",
      description: "Promotions and offers.",
      icon: <MessageSquare className="text-orange-600 h-5 w-5" />,
    },
    {
      key: "orderUpdates",
      label: "Order Updates",
      description: "Track order status.",
      icon: <Check className="text-blue-600 h-5 w-5" />,
    },
    {
      key: "newArrivals",
      label: "New Arrivals",
      description: "Be notified of new items.",
      icon: <Settings className="text-rose-600 h-5 w-5" />,
    },
  ] as const

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>

      {message.text && (
        <Alert
          className={`${
            message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="text-green-600 h-4 w-4" />
          ) : (
            <AlertCircle className="text-red-600 h-4 w-4" />
          )}
          <AlertDescription
            className={message.type === "success" ? "text-green-800" : "text-red-800"}
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {settingList.map(({ key, label, description, icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <Label className="text-base font-medium">{label}</Label>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
            <Switch
              checked={settings[key]}
              onCheckedChange={(checked) => updateSetting(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
