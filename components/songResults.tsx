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
          {songs.map((song, idx) => (
            <div
              key={song.id ?? `${song.title}-${song.artist}-${idx}`}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-pink-100 cursor-pointer"
              onClick={() => onSelect(song)}
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={song.image || "/placeholder.svg"}
                    alt={`${song.title} by ${song.artist}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-purple-800">
                    {song.title}
                  </h3>
                  <p className="text-gray-600">{song.artist}</p>

                  <div className="mt-2 flex flex-col gap-1">
                    {song.preview_url ? (
                      <audio
                        controls
                        src={song.preview_url}
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        プレビューなし
                      </span>
                    )}

                    {song.spotify_url && (
                      <a
                        href={song.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-pink-600 hover:text-pink-800 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Spotifyで聴く
                      </a>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-pink-600 border-pink-200 hover:bg-pink-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(song);
                      }}
                    >
                      <HeartIcon className="h-4 w-4 mr-1" />
                      選択
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
