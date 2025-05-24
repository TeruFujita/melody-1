import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface LikeItem {
  id: string
  title: string
  date: string
  imageUrl?: string
}

export function LikesList() {
  // TODO: APIからいいねデータを取得する
  const likeItems: LikeItem[] = [
    {
      id: "1",
      title: "サンプルアイテム1",
      date: "2024-03-20",
      imageUrl: "/placeholder.png"
    },
    // 他のアイテムを追加
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>いいねしたアイテム</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {likeItems.map((item) => (
              <div
                key={item.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                {item.imageUrl && (
                  <div className="aspect-square relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 