import { Metadata } from "next"
import { LikesList } from "@/components/likes/likes-list"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "いいね",
  description: "あなたがいいねしたアイテムを確認できます",
}

export default function LikesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">いいね</h1>
          <LikesList />
        </div>
      </main>
    </div>
  )
} 