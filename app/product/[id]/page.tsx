import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = Number.parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  return <ProductDetailClient productId={productId} />
}
