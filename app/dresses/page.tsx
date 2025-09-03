import DressesClient from "./DressesClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Elegant Dresses - Sonaa Moda Style",
  description:
    "Browse our stunning collection of dresses for every occasion. From casual to formal, find your perfect dress.",
  icons: { icon: "/favicon.ico" },
}

export default function DressesPage() {
  return <DressesClient />
}
