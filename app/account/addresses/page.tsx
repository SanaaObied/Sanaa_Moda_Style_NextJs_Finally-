import { Suspense } from "react"
import AddressesClient from "./AddressesClient"

export default function AddressesPage() {
  return (
    <Suspense fallback={<div>Loading addresses...</div>}>
      <AddressesClient />
    </Suspense>
  )
}
