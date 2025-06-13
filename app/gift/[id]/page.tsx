import { Navbar } from "@/components/navbar";
import { MusicCard } from "@/components/musicCard";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShareIcon } from "lucide-react";
import Link from "next/link";

interface GiftPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GiftPage({ params }: GiftPageProps) {
  const resolvedParams = await params;
  // 実際のアプリでは、ここでIDを使ってDBからデータを取得する

  //仮の音楽データ
  const mockSong = {
    title: "Happy",
    artist: "Pharrell Williams",
    image: "/placeholder.svg?height=300&width=300",
  };

  const mockMessage =
    "この曲を聴くと、心が軽くなる気がします。あなたの「今日は疲れた」という気持ちに寄り添えたら嬉しいです。";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-purple-800 mb-2">
              あなたに音楽が届きました
            </h1>
          </div>

          <div className="mb-8">
            <MusicCard song={mockSong} message={mockMessage} />
          </div>

          {/*送られた音楽のURLを貼る*/}
          <div className="flex flex-col gap-4">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              Spotifyで聴く
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <HeartIcon className="h-4 w-4 mr-2" />
                ありがとう
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                共有する
              </Button>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/create"
                className="text-pink-600 hover:text-pink-700 text-sm"
              >
                あなたも誰かに音楽を贈りませんか？
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
