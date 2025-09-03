import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

// Static data for demonstration - you'll replace this with API data
const products = [
  {
    id: 1,
    name: "سماعات لاسلكية",
    description: "سماعات عالية الجودة مع تقنية إلغاء الضوضاء",
    image: "/placeholder.svg?height=300&width=300",
    price: "299 ريال",
  },
  {
    id: 2,
    name: "هاتف ذكي",
    description: "هاتف ذكي بمواصفات متقدمة وكاميرا عالية الدقة",
    image: "/placeholder.svg?height=300&width=300",
    price: "1299 ريال",
  },
  {
    id: 3,
    name: "ساعة ذكية",
    description: "ساعة ذكية لتتبع اللياقة البدنية والصحة",
    image: "/placeholder.svg?height=300&width=300",
    price: "599 ريال",
  },
  {
    id: 4,
    name: "حقيبة ظهر",
    description: "حقيبة ظهر عملية ومقاومة للماء",
    image: "/placeholder.svg?height=300&width=300",
    price: "199 ريال",
  },
  {
    id: 5,
    name: "كاميرا رقمية",
    description: "كاميرا احترافية للتصوير الفوتوغرافي",
    image: "/placeholder.svg?height=300&width=300",
    price: "2499 ريال",
  },
  {
    id: 6,
    name: "لابتوب",
    description: "لابتوب عالي الأداء للعمل والألعاب",
    image: "/placeholder.svg?height=300&width=300",
    price: "3999 ريال",
  },
]

export default function ProductsSection() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">منتجاتنا</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">اكتشف مجموعتنا المتنوعة من المنتجات عالية الجودة</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    إضافة للسلة
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
