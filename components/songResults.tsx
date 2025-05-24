"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { HeartIcon, RefreshCwIcon } from "lucide-react";
import { useLikes } from "@/lib/likes-context";

interface Song {
  id?: number;
  title: string;
  artist: string;
  image: string;
  preview_url?: string;
  spotify_url?: string;
}

interface SongResultsProps {
  songs: Song[];
  emotion: string;
  onSelect: (song: Song) => void;
  onRetry: () => void;
}

export default function SongResults({
  songs,
  emotion,
  onSelect,
  onRetry,
}: SongResultsProps) {
  const { isLiked, toggleLike } = useLikes();

  // 曲の重複（タイトル＋アーティスト）を排除
  const uniqueSongs: Song[] = [];
  const seen = new Set<string>();
  songs.forEach((song) => {
    const key = `${song.title}-${song.artist}`;
    if (!seen.has(key)) {
      uniqueSongs.push(song);
      seen.add(key);
    }
  });

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-800">
          あなたの気持ちに合った曲
        </CardTitle>
        <CardDescription className="text-gray-600">
          「{emotion}」の感情に合わせて、以下の曲を見つけました。
          気に入った曲を選んでください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueSongs.map((song) => {
            const songKey = `${song.id ?? "noid"}-${song.title}-${song.artist}`;
            return (
              <div
                key={songKey}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-pink-100 cursor-pointer"
                onClick={() => onSelect(song)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      width={96}
                      height={96}
                      src={song.image || "/placeholder.svg"}
                      alt={song.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {song.artist}
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`text-pink-600 border-pink-200 hover:bg-pink-50 ${
                          isLiked(songKey) ? "bg-pink-50" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("いいねボタン押下", song);
                          toggleLike({
                            title: song.title,
                            artist: song.artist,
                            image: song.image,
                            spotify_url: song.spotify_url
                          });
                        }}
                      >
                        <HeartIcon
                          className={`h-4 w-4 mr-1 ${
                            isLiked(songKey) ? "fill-pink-600" : ""
                          }`}
                        />
                        {isLiked(songKey) ? "いいね済み" : "いいね"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="outline"
          className="border-pink-300 text-pink-700 hover:bg-pink-50"
          onClick={onRetry}
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          他の曲を探す
        </Button>
      </CardFooter>
    </Card>
  );
}
