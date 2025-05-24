"use client";

import { useState } from "react";
import EmotionInput from "../../components/emotionInput";
import SongResults from "../../components/songResults";
import CardCreator from "../../components/cardCreator";
import { Navbar } from "@/components/navbar";

type Step = "input" | "results" | "create";

export default function Create() {
  const [step, setStep] = useState<Step>("input");
  const [emotion, setEmotion] = useState<string | null>(null);
  type Song = { id: number; title: string; artist: string; image: string };
  const [song, setSong] = useState<Song | null>(null);

  const handleEmotionSubmit = async (analyzeResult: string) => {
    setEmotion(emotion);
    setStep("results");

    //spotify APIを呼び出して音楽データを取得する
    const res = await fetch("api/search-songs", {
      method: "POST",
      body: JSON.stringify({ keyword: analyzeResult }),
    });

    const data = await res.json();
    setSong(data.tracks);
  };
  const handleSongSelect = (song: Song) => {
    setSong(song);
    setStep("create");
  };

  const renderStep = () => {
    switch (step) {
      case "input":
        return <EmotionInput onSubmit={handleEmotionSubmit} />;
      case "results":
        return (
          <SongResults
            songs={song ? [song] : []}
            onSelect={handleSongSelect}
            emotion={emotion ?? ""}
          />
        );
      case "create":
        return song ? (
          <CardCreator song={song} emotion={emotion ?? ""} />
        ) : null;
      default:
        return <EmotionInput onSubmit={handleEmotionSubmit} />;
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
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "input"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-200 text-pink-700"
                }`}
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
                  step === "results"
                    ? "bg-pink-500 text-white"
                    : step === "create"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-200 text-pink-700"
                }`}
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
                }`}
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
