import UpdateProfileForm from "./UpdateProfileForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Update Profile - Sonaa Moda Style",
  description: "Edit your personal, security, and address information.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function UpdateProfilePage() {
  return <UpdateProfileForm />
}
