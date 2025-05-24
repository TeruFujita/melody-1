"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LikeContextType {
  likedSongs: Set<number>;
  toggleLike: (songId: number) => void;
  isLiked: (songId: number) => boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());

  const toggleLike = (songId: number) => {
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

  const isLiked = (songId: number) => {
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