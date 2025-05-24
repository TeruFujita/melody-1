import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

export const metadata: Metadata = {
  title: "履歴",
  description: "あなたの履歴を確認できます",
}

export default function HistoryPage() {
  // TODO: APIから履歴データを取得する
  const historyItems: HistoryItem[] = [
    {
      id: "1",
      title: "サンプルアイテム1",
      date: "2024-03-20",
      type: "gift"
    },
    // 他のアイテムを追加
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>最近の履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.type}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 