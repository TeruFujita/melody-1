"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon, ShareIcon, SparklesIcon } from "lucide-react";
import { Input } from "./ui/input";
import { MusicCard } from "./musicCard";

interface CardCreatorProps {
  song: {
    id: number;
    title: string;
    artist: string;
    image: string;
  };
  emotion: string;
}

export default function CardCreator({ song, emotion }: CardCreatorProps) {
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const generateMessage = () => {
    setIsGenerating(true);
    //ここで、AI APIを呼び出してメッセージを生成する
    setTimeout(() => {
      setMessage(
        `「${emotion}」の気持ちにぴったりな曲は「${song.title}」です。`
      );
      setIsGenerating(false);
    }, 1500);
  };

  const createCard = () => {
    // ここでカードを作成してDBに保存する
    setTimeout(() => {
      setIsCreated(true);
      setShareUrl("https://mood-melody.vercel.app/gift/abc123");
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("メッセージがクリップボードにコピーされました！");
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-800">
          曲カードを作成
        </CardTitle>
        <CardDescription className="text-gray-600">
          選んだ曲のカードをカスタマイズして、大切な人に贈りましょう。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="flex flex-col justify-end h-full min-h-[350px]">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メッセージ
              </label>
              <div className="relative">
                <Textarea
                  placeholder="この曲に込めた思いを書いてください..."
                  className="min-h-[250px] border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 text-xs border-pink-200 text-pink-700 hover:bg-pink-50"
                  onClick={generateMessage}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <SparklesIcon className="h-3 w-3 mr-1 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      AIに作成してもらう
                    </>
                  )}
                </Button>
              </div>
            </div>
            {!isCreated ? (
              <Button
                onClick={createCard}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                カードを作成する
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span>カードが作成されました！</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    共有リンク
                  </label>
                  <div className="flex">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="rounded-r-none border-pink-200"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="rounded-l-none bg-pink-500 hover:bg-pink-600"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    LINEで送る
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Twitterで共有
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              プレビュー
            </h3>
            <MusicCard
              song={song}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
