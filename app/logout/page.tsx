import LogoutClient from "./LogoutClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Logout - Sonaa Moda Style",
  description: "You have been successfully logged out. Thank you for visiting Sonaa Moda Style.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function LogoutPage() {
  return <LogoutClient />
}
