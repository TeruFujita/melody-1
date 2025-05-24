// app/history/HistoryPageClient.tsx
"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface HistoryItem {
  id: string;
  songTitle: string;
  songArtist: string;
  songImageUrl: string;
  emotion: string;
  createdAt: string;
  spotifyUrl?: string;
}

export default function HistoryPageClient() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const user_id = data?.user?.id;
      if (!user_id) {
        setHistoryItems([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/history?user_id=${user_id}`);
      if (res.ok) {
        const history = await res.json();
        setHistoryItems(history);
      } else {
        setHistoryItems([]);
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
              <CardTitle>検索履歴</CardTitle>
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
                <div className="max-h-[600px] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {
                          if (item.spotifyUrl) {
                            window.open(item.spotifyUrl, '_blank');
                          }
                        }}
                      >
                        {item.songImageUrl && (
                          <div className="aspect-square relative">
                            <Image
                              src={item.songImageUrl}
                              alt={item.songTitle}
                              fill
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-medium">{item.songTitle}</h3>
                          <p className="text-sm text-gray-500">
                            {item.songArtist}
                          </p>
                          <p className="text-xs text-pink-500 mt-1">
                            {item.emotion}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {item.spotifyUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.spotifyUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="h-5 w-5 text-green-500" />
                          </Button>
                        )}
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
