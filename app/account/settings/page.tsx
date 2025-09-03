import { Suspense } from "react"
import AccountSettingsClient from "./AccountSettingsClient"

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<div>Loading account settings...</div>}>
      <AccountSettingsClient />
    </Suspense>
  )
}
