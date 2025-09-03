import History from "./History"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order History - Sonaa Moda Style",
  description: "View all your past orders and their status.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function Page() {
  return <History />
}
