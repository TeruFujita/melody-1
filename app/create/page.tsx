"use client";

import { useState } from "react";
import EmotionInput from "../../components/emotionInput";
import SongResults from "../../components/songResults";
import CardCreator from "../../components/cardCreator";
import { Navbar } from "@/components/navbar";
import { extractSongsAsJson } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Step = "input" | "results" | "create" | "loading" | "result";

type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  image: string;
  preview_url: string | null;
  spotify_url: string;
};

// 曲名・アーティスト名の正規化関数
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s　]+/g, "") // 全角・半角スペース除去
    .replace(/[‐‑‒–—―ー−]/g, '-') // ダッシュ類を統一
    .replace(/[！!]/g, '!') // 記号例
    .normalize('NFKC'); // 全角半角正規化
}

// 配列シャッフル関数
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Create() {
  const [step, setStep] = useState<Step>("input");
  const [emotion, setEmotion] = useState<string>("");
  type Song = { title: string; artist: string; image: string; preview_url?: string; spotify_url?: string; id?: number };
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  // 表示済み曲のキー履歴を管理
  const [shownSongKeys, setShownSongKeys] = useState<string[]>([]);
  const [displaySongs, setDisplaySongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 曲の一意キーを生成
  function getSongKey(song: Song) {
    return `${song.title}-${song.artist}`;
  }

  const handleEmotionSubmit = async (analyzeResult: string, userEmotion: string) => {
    setEmotion(userEmotion);
    setStep("loading");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion: analyzeResult }),
      });
      if (!res.ok) throw new Error("Failed to get recommendations");
      const data = await res.json();
      setDisplaySongs(data.songs);
      setStep("result");

      // 履歴を保存
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const song of data.songs) {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              songTitle: song.title,
              songArtist: song.artist,
              songImageUrl: song.image,
              emotion: userEmotion,
              spotifyUrl: song.spotify_url,
            }),
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("曲の推薦に失敗しました。もう一度お試しください。");
      setStep("input");
    }
  };

  const handleSongSelect = async (song: Song) => {
    // Spotify APIでプレビューURLとSpotifyリンクを取得
    let preview_url = undefined;
    let spotify_url = undefined;
    try {
      const res = await fetch("/api/search-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: `${song.title} ${song.artist}` }),
      });
      const data = await res.json();
      if (data.tracks && data.tracks.length > 0) {
        console.log('Spotify track data:', data.tracks[0]);
        preview_url = data.tracks[0].preview_url;
        spotify_url = data.tracks[0].spotify_url;
      }
    } catch {}
    setSelectedSong({ ...song, preview_url, spotify_url, id: song.id });
    setStep("create");

    // --- 履歴を保存 ---
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // emotionが空の場合は"未入力"で補完
      let saveEmotion = emotion;
      if (!saveEmotion) saveEmotion = "未入力";
      if (user) {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            emotion: saveEmotion,
            songTitle: song.title,
            songArtist: song.artist,
            songImageUrl: song.image,
            spotifyUrl: song.spotify_url || spotify_url,
          }),
        });
      }
    } catch (e) { console.error("履歴保存エラー", e); }
  };

  const handleRetry = async () => {
    if (!emotion) return;
    setStep("results");
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: emotion }),
    });
    const data = await response.json();
    await handleEmotionSubmit(data.keywords, emotion);
  };

  const renderStep = () => {
    switch (step) {
      case "input":
        return <EmotionInput onSubmit={(result, userEmotion) => handleEmotionSubmit(result, userEmotion)} />;
      case "results":
        return (
          <SongResults
            songs={songs}
            onSelect={handleSongSelect}
            emotion={emotion}
            onRetry={handleRetry}
          />
        );
      case "create":
        return selectedSong ? (
          <CardCreator song={{ ...selectedSong, ...(selectedSong.id ? { id: selectedSong.id } : {}) }} emotion={emotion} />
        ) : null;
      case "loading":
        return <div>Loading...</div>;
      case "result":
        return (
          <div>
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <SongResults
                songs={displaySongs}
                onSelect={handleSongSelect}
                emotion={emotion}
                onRetry={handleRetry}
              />
            )}
          </div>
        );
      default:
        return <EmotionInput onSubmit={(result, userEmotion) => handleEmotionSubmit(result, userEmotion)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                  step === "input"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-200 text-pink-700"
                }`}
                onClick={() => setStep("input")}
              >
                1
              </div>
              <div
                className={`w-20 h-1 ${
                  step === "input" ? "bg-pink-200" : "bg-pink-500"
                }`}
              ></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "results" || step === "create"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-200 text-pink-700"
                } ${emotion ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                onClick={() => {
                  if (emotion) {
                    if (displaySongs.length > 0) setSongs(displaySongs);
                    setStep("results");
                  }
                }}
              >
                2
              </div>
              <div
                className={`w-20 h-1 ${
                  step === "create" ? "bg-pink-500" : "bg-pink-200"
                }`}
              ></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "create"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-200 text-pink-700"
                } ${emotion ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                onClick={() => {
                  if (emotion) setStep("create");
                }}
              >
                3
              </div>
            </div>
          </div>
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
