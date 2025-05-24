import { Metadata } from "next"
import { HistoryList } from "@/components/history/history-list"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "履歴",
  description: "あなたの履歴を確認できます",
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">履歴</h1>
          <HistoryList />
        </div>
      </main>
    </div>
  )
} 