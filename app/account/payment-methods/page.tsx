import { Suspense } from "react"
import PaymentMethodsClient from "./PaymentMethodsClient"

export default function PaymentMethodsPage() {
  return (
    <Suspense fallback={<div>Loading payment methods...</div>}>
      <PaymentMethodsClient />
    </Suspense>
  )
}
