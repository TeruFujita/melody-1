// app/history/HistoryPageClient.tsx
"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface HistoryItem {
  id: string;
  songTitle: string;
  songArtist: string;
  emotion: string;
  createdAt: string;
  spotifyUrl?: string;
  songImageUrl?: string;
}

export default function HistoryPageClient() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        console.error("User not authenticated");
        setHistoryItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`api/history?userId=${userId}`);
      if (!res.ok) {
        setHistoryItems([]);
      } else {
        const history = await res.json();
        setHistoryItems(history);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>最近の履歴</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  読み込み中...
                </div>
              ) : historyItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  履歴がありません。
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <h3 className="font-medium">{item.songTitle}</h3>
                          <p className="text-sm text-gray-500">
                            {item.songArtist}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.emotion}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
