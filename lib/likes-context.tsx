"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/lib/supabase";

interface LikeContextType {
  likedSongs: Set<string>;
  toggleLike: (song: {
    title: string;
    artist: string;
    image: string;
    spotify_url?: string;
  }) => Promise<void>;
  isLiked: (songKey: string) => boolean;
  refreshLikes: () => Promise<void>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

  // GoogleログインユーザーのいいねをSupabaseから取得
  const refreshLikes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLikedSongs(new Set());
      return;
    }
    const { data, error } = await supabase
      .from("Favorite")
      .select("songTitle,songArtist")
      .eq("user_id", user.id);
    if (error) return;
    const keys = data.map(
      (item: any) => `${item.songTitle}-${item.songArtist}`
    );
    setLikedSongs(new Set(keys));
  };

  useEffect(() => {
    refreshLikes();
  }, []);

  const toggleLike = async (song: {
    title: string;
    artist: string;
    image: string;
    spotify_url?: string;
  }) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user) return;
    const songKey = `${song.title}-${song.artist}`;
    if (likedSongs.has(songKey)) {
      // いいね解除（API経由）
      const res = await fetch("/api/likes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          songTitle: song.title,
          songArtist: song.artist,
        }),
      });
      if (res.ok) {
        setLikedSongs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(songKey);
          return newSet;
        });
      } else {
        const errText = await res.text();
        alert("いいね解除に失敗しました: " + errText);
      }
    } else {
      // いいね追加（API経由）
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          songTitle: song.title,
          songArtist: song.artist,
          songImageUrl: song.image,
          spotifyUrl: song.spotify_url,
          sourceType: "AI",
          sourceId: (song as any).id ? String((song as any).id) : "unknown",
        }),
      });
      if (res.ok) {
        setLikedSongs((prev) => new Set(prev).add(songKey));
      } else {
        const errText = await res.text();
        alert("いいね追加に失敗しました: " + errText);
      }
    }
  };

  const isLiked = (songKey: string) => {
    return likedSongs.has(songKey);
  };

  return (
    <LikeContext.Provider
      value={{ likedSongs, toggleLike, isLiked, refreshLikes }}
    >
      {children}
    </LikeContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error("useLikes must be used within a LikeProvider");
  }
  return context;
}
