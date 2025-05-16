import Link from "next/link";
import { Button } from "./ui/button";
import { TbMusicQuestion } from "react-icons/tb";

export function Login() {
  return (
    <section className="py-30 flex flex-col items-center justify-center gap-12">
      <div className="flex-1 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 p-4 w-24 h-24 rounded-full ">
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
          <Link href="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600
                    hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg font-medium"
            >
              今の気持ちは？？
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
