import { NextResponse } from "next/server";

// Gemini APIクライアントの初期化
const { GoogleGenerativeAI } = await import("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `あなたは日本の音楽キュレーターです。ユーザーの感情や状況を最重要視し、その気持ちに最も合致する日本の楽曲を厳選して提案してください。
- 2000年以降の曲を優先
- 曲名とアーティスト名だけを日本語のJSON配列で最低4曲以上返してください
- 例: [{"title": "曲名", "artist": "アーティスト名"}, ...]
- 理由やジャンル、リリース年などは一切含めないでください
- 必ずSpotifyで検索可能な有名曲・正確な表記を使ってください
- ユーザーの入力内容にできるだけ忠実に、感情や状況にピッタリ合う曲を選んでください
- 日本語で出力してください
- 同じ感情や状況でも、返す曲リストは毎回できるだけ違う組み合わせになるようにランダムに選んでください
- 有名曲だけでなく、隠れた名曲やジャンル違いも時々混ぜてください
- 同じ曲が連続しないようにしてください`;

// Spotify APIのアクセストークンを取得
async function getSpotifyToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Spotifyで曲を検索
async function searchSpotifyTrack(
  title: string,
  artist: string,
  token: string
) {
  const query = `${title} ${artist}`;
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (data.tracks?.items?.[0]) {
    const track = data.tracks.items[0];
    return {
      title: track.name,
      artist: track.artists[0].name,
      image:
        track.album.images[0]?.url || "/placeholder.svg?height=300&width=300",
      spotify_url: track.external_urls.spotify,
    };
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { emotion } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "APIキーが設定されていません" },
        { status: 500 }
      );
    }

    // Geminiから曲のリストを取得
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `${SYSTEM_PROMPT}\n\nユーザーの感情・状況: ${emotion}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const songsJson = response.text();

    // JSONとしてパース
    let songs;
    try {
      songs = JSON.parse(songsJson);
    } catch {
      return NextResponse.json(
        { error: "Geminiの返答が不正です", raw: songsJson },
        { status: 500 }
      );
    }

    // Spotify APIのトークンを取得
    const token = await getSpotifyToken();

    // 各曲のSpotify情報を取得
    const spotifySongs = await Promise.all(
      songs.map(async (song: { title: string; artist: string }) => {
        const spotifyTrack = await searchSpotifyTrack(
          song.title,
          song.artist,
          token
        );
        if (spotifyTrack) {
          return spotifyTrack;
        }
        // Spotifyで見つからない場合は元の情報を使用
        return {
          ...song,
          image: "/placeholder.svg?height=300&width=300",
          spotify_url: `https://open.spotify.com/search/${encodeURIComponent(
            `${song.title} ${song.artist}`
          )}`,
        };
      })
    );

    return NextResponse.json({ songs: spotifySongs });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
