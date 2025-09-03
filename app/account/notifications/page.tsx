import NotificationSettings from "./NotificationSettings"

export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
        <NotificationSettings />
      </div>
    </div>
  )
}
