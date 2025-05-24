"use client";

import { useState } from "react";
import EmotionInput from "../../components/emotionInput";
import SongResults from "../../components/songResults";
import CardCreator from "../../components/cardCreator";
import { Navbar } from "@/components/navbar";
import { extractSongsAsJson } from "@/lib/utils";

type Step = "input" | "results" | "create";

// 曲名・アーティスト名の正規化関数
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s　]+/g, "") // 全角・半角スペース除去
    .replace(/[‐‑‒–—―ー−]/g, '-') // ダッシュ類を統一
    .replace(/[！!]/g, '!') // 記号例
    .normalize('NFKC'); // 全角半角正規化
}

export default function Create() {
  const [step, setStep] = useState<Step>("input");
  const [emotion, setEmotion] = useState<string>("");
  type Song = { title: string; artist: string; image: string; preview_url?: string; spotify_url?: string; id?: number };
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  //仮の音楽データ
  // const musicData = [
  //   { id: 1, title: "Song A", artist: "Artist A", image: "/placeholder1.jpg" },
  //   { id: 2, title: "Song B", artist: "Artist B", image: "/placeholder2.jpg" },
  //   { id: 3, title: "Song C", artist: "Artist C", image: "/placeholder3.jpg" },
  // ];

  const handleEmotionSubmit = async (analyzeResult: string, userEmotion: string) => {
    setEmotion(userEmotion);
    setStep("results");
    let songList: Song[] = [];
    try {
      songList = JSON.parse(analyzeResult);
      if (!Array.isArray(songList)) {
        songList = extractSongsAsJson(analyzeResult) as Song[];
      }
    } catch {
      songList = extractSongsAsJson(analyzeResult) as Song[];
    }

    // Spotify APIで画像URLを取得して上書き
    const updatedSongs: Song[] = [];
    for (const song of songList) {
      try {
        const res = await fetch("/api/search-songs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: `${song.title} ${song.artist}` }),
        });
        const data = await res.json();
        let matchedTrack: any = null;
        if (data.tracks && data.tracks.length > 0) {
          // 正規化して完全一致する曲を探す（曲名・アーティスト名ともに）
          matchedTrack = data.tracks.find(
            (track: any) =>
              normalize(track.title) === normalize(song.title) &&
              normalize(track.artist) === normalize(song.artist)
          );
          // 完全一致がなければ部分一致（アーティスト名含む）
          if (!matchedTrack) {
            matchedTrack = data.tracks.find(
              (track: any) =>
                normalize(track.title) === normalize(song.title) &&
                normalize(track.artist).includes(normalize(song.artist))
            );
          }
          // それもなければ最初の候補
          if (!matchedTrack) matchedTrack = data.tracks[0];
          updatedSongs.push({
            ...song,
            image: matchedTrack.image || song.image,
            preview_url: matchedTrack.preview_url,
            spotify_url: matchedTrack.spotify_url,
            id: matchedTrack.id,
          });
        } else {
          updatedSongs.push(song);
        }
      } catch {
        updatedSongs.push(song);
      }
    }
    setSongs(updatedSongs);
    setSelectedSong(null);
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
          <>
            <SongResults
              songs={songs}
              onSelect={handleSongSelect}
              emotion={emotion}
              onRetry={handleRetry}
            />
          </>
        );
      case "create":
        return selectedSong ? (
          <CardCreator song={{ ...selectedSong, ...(selectedSong.id ? { id: selectedSong.id } : {}) }} emotion={emotion} />
        ) : null;
      default:
        return <EmotionInput onSubmit={(result, userEmotion) => handleEmotionSubmit(result, userEmotion)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
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
                  if (emotion) setStep("results");
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
