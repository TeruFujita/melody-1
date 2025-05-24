"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LikeContextType {
  likedSongs: Set<string>;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const isLiked = (songId: string) => {
    return likedSongs.has(songId);
  };

  return (
    <LikeContext.Provider value={{ likedSongs, toggleLike, isLiked }}>
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