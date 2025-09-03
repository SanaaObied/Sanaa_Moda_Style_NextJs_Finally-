import Form from "./Form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change Password - Sonaa Moda Style",
  description: "Securely change your account password.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function ChangePasswordPage() {
  return <Form />
}
