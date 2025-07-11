import { MusicIcon, SparklesIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface EmotionInoutProps {
  onSubmit: (analyzeResult: string, userEmotion: string) => void;
}

export default function EmotionInput({ onSubmit }: EmotionInoutProps) {
  const [emotion, setEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const example = [
    "今日は疲れた。癒しが欲しい",
    "新しい仕事が決まって嬉しい！",
    "友達と久しぶりに会えて楽しかった",
    "雨の日の静かな午後、物思いにふける気分",
  ];

  const handleSubmit = async () => {
    if (!emotion.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: emotion }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "感情の分析中にエラーが発生しました"
        );
      }

      // ここで、AIからのレスポンスを処理
      console.log("Generated keywords:", data.keywords);
      onSubmit(data.keywords, emotion);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "感情の分析中にエラーが発生しました";
      setError(errorMessage);
      console.error("Full error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-800">
          あなたの気持ちを教えてください
        </CardTitle>
        <CardDescription className="text-gray-600">
          今の感情や状況を自由に入力してください。AIがあなたの気持ちに合った曲を提案します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="例: 「今日は疲れた」「嬉しいことがあった」「落ち込んでいる」など..."
          className="min-h-[150px] text-lg p-4 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        />

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">入力例:</p>
          <div className="flex flex-wrap gap-2">
            {example.map((example: string, i: number) => (
              <Button
                key={i}
                variant="outline"
                className="text-sm border-pink-200 text-pink-700 hover:bg-pink-50"
                onClick={() => setEmotion(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!emotion.trim() || isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg font-medium w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <SparklesIcon className="mr-2 h-5 w-5 animate-spin" />
              感情を分析中...
            </>
          ) : (
            <>
              <MusicIcon className="mr-2 h-5 w-5" />
              曲を探す
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
