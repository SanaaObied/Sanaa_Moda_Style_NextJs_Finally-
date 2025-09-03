import ContactForm from "./ContactForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Sonaa Moda Style",
  description: "Get in touch with Sonaa Moda Style for inquiries and support. We're here to help!",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function ContactPage() {
  return <ContactForm />
}
