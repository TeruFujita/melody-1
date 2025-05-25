// /api/youtube-search.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      query
    )}&type=video&key=${YOUTUBE_API_KEY}`
  );

  const data = await res.json();
  const videoId = data.items?.[0]?.id?.videoId;

  return Response.json({ videoId });
}
