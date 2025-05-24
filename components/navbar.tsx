import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MusicIcon, HeartIcon } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6 text-pink-500" />
          <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Mood Melody
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/create"
            className="text-gray-700 hover:text-pink-500 transition-colors"
          >
            曲を探す
          </Link>
          <Link
            href="/history"
            className="text-gray-700 hover:text-pink-500 transition-colors"
          >
            履歴
          </Link>
          <Link
            href="/likes"
            className="text-gray-700 hover:text-pink-500 transition-colors flex items-center gap-1"
          >
            <HeartIcon className="h-4 w-4" />
            いいね
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/create">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              始める
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
