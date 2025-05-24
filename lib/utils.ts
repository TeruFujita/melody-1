import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Geminiの返答から曲名とアーティスト名を抽出する関数
export type SongInfo = {
  title: string;
  artist: string;
};

export function extractSongsFromGeminiResponse(response: string): SongInfo[] {
  const songList: SongInfo[] = [];
  // 曲ごとに分割（1. **曲名:** で始まる部分）
  const songBlocks = response.split(/\n\s*\d+\. \*\*曲名:\*\*/).slice(1);

  for (const block of songBlocks) {
    // 曲名
    const titleMatch = block.match(/^(.+?)\n\s*\*\*アーティスト名:\*\*\s*(.+)$/m);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      const artistLine = titleMatch[2];
      // アーティスト名
      const artistMatch = artistLine.match(/^(.+?)(\n|$)/);
      const artist = artistMatch ? artistMatch[1].trim() : "";
      if (title && artist) {
        songList.push({ title, artist });
      }
    }
  }
  return songList;
}

// Geminiの返答から曲名とアーティスト名だけを抽出し、JSON配列で返す関数
export function extractSongsAsJson(response: string): { title: string; artist: string }[] {
  const songList: { title: string; artist: string }[] = [];
  // 曲名とアーティスト名を抽出する正規表現
  const regex = /曲名:\s*([^\n]+)[\s\S]*?アーティスト名:\s*([^\n]+)/g;
  let match;
  while ((match = regex.exec(response)) !== null) {
    const title = match[1].trim();
    const artist = match[2].trim();
    if (title && artist) {
      songList.push({ title, artist });
    }
  }
  return songList;
}
