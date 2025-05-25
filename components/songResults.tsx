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
import { Song } from "@/types/song";
import { useRef, useState } from "react";

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
  const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const players = useRef<{ [key: string]: YT.Player | null }>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const uniqueSongs: Song[] = [];
  const seen = new Set<string>();
  songs.forEach((song) => {
    const key = `${song.title}-${song.artist}`;
    if (!seen.has(key)) {
      uniqueSongs.push(song);
      seen.add(key);
    }
  });

  const handlePlay = (song: Song, songKey: string) => {
    const videoId = song.youtubeVideoId;
    if (!videoId) return;

    if (players.current[songKey]) {
      const player = players.current[songKey]!;
      if (activeVideoId === videoId) {
        player.pauseVideo();
        setActiveVideoId(null);
      } else {
        player.playVideo();
        setActiveVideoId(videoId);
      }
      return;
    }

    const createPlayer = () => {
      const player = new window.YT.Player(playerRefs.current[songKey]!, {
        height: "0",
        width: "0",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(100);
            event.target.playVideo();
            setActiveVideoId(videoId);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setActiveVideoId(null);
            }
          },
        },
      });

      players.current[songKey] = player;
    };

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }
  };

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
            const songKey = `${song.title}-${song.artist}`;
            return (
              <div
                key={songKey}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-pink-100 cursor-pointer"
                onClick={() => onSelect(song)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={song.image || "/placeholder.svg"}
                      alt={song.title}
                      width={50}
                      height={50}
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
                          toggleLike({
                            title: song.title,
                            artist: song.artist,
                            image: song.image,
                            spotify_url: song.spotify_url,
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
                    {song.youtubeVideoId && (
                      <>
                        <div
                          id={`player-${songKey}`}
                          ref={(el) => {
                            playerRefs.current[songKey] = el;
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePlay(song, songKey);
                          }}
                        >
                          {activeVideoId === song.youtubeVideoId
                            ? "停止"
                            : "プレビュー再生"}
                        </Button>
                      </>
                    )}
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
