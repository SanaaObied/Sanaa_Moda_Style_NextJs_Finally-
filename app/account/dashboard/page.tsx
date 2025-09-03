import AccountDashboard from "../AccountDashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Dashboard - Sonaa Moda Style",
  description: "Manage your orders, profile, and account settings.",
  icons: { icon: "/favicon.ico" },
}

export default function DashboardPage() {
  return <AccountDashboard />
}
