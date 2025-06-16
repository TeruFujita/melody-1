"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TbMusicQuestion } from "react-icons/tb";
import { supabase } from "@/lib/supabase"; // ←自分の supabase client のパスに応じて修正

export function Top() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/create`
      }
    });
  };

  return (
    <section className="py-30 flex flex-col items-center justify-center gap-12">
      <div className="flex-1 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 p-4 w-24 h-24 rounded-full">
            <TbMusicQuestion className="text-6xl text-gradient" />
          </div>
          <h1 className="text-4xl font-bold leading-tight text-center mt-15">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mood Melody
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            今のあなたの気持ちを入力するだけで、AIがあなたにピッタリの曲を提案。
          </p>
        </div>
        <div className="flex flex-wrap gap-4 pt-4 items-center justify-center">
          {user ? (
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600
                  hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg font-medium"
              >
                今の気持ちは？？
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600
                hover:to-green-700 text-white px-8 py-6 rounded-full text-lg font-medium"
            >
              Googleで認証
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
