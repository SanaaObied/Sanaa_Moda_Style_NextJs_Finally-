import RegistrationForm from "./RegistrationForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registration - Sonaa Moda Style",
  description: "Create your account and join the Sonaa Moda Style community.",
  icons: { icon: "/favicon.ico" },
}

export default function RegistrationPage() {
  return <RegistrationForm />
}
