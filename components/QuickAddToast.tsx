"use client"

import { CheckCircle, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface QuickAddToastProps {
  product: {
    title: string
    image: string
    price: string
    size: string
  }
  onViewCart: () => void
  onClose: () => void
}

export default function QuickAddToast({ product, onViewCart, onClose }: QuickAddToastProps) {
  return (
    <Card className="w-80 shadow-lg border-0 bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                width={40}
                height={50}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                <p className="text-sm text-gray-500">
                  Size: {product.size} • {product.price}
                </p>
              </div>
            </div>

            <p className="text-sm text-green-600 font-medium mb-3">Added to cart successfully!</p>

            <div className="flex gap-2">
              <Button size="sm" onClick={onViewCart} className="flex-1 bg-rose-600 hover:bg-rose-700 h-8 text-xs">
                <ShoppingCart className="h-3 w-3 mr-1" />
                View Cart
              </Button>
              <Button size="sm" variant="outline" onClick={onClose} className="px-2 h-8">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
