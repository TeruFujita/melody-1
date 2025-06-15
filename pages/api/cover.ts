import type { NextApiRequest, NextApiResponse } from "next";

// ダミー画像（public/no-image.png などを用意してください）
const DUMMY_IMAGE_URL = "/no-image.png";

// Spotify API認証（Client Credentials Flow）
async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  console.log("Spotify access token:", data.access_token);
  return data.access_token;
}

// Spotify APIから画像URL取得
async function getSpotifyImageUrl(
  trackId?: string,
  albumId?: string
): Promise<string | null> {
  const accessToken = await getSpotifyAccessToken();
  let url = "";
  if (trackId) {
    url = `https://api.spotify.com/v1/tracks/${trackId}`;
  } else if (albumId) {
    url = `https://api.spotify.com/v1/albums/${albumId}`;
  } else {
    return null;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.album && data.album.images && data.album.images[0]) {
    return data.album.images[0].url;
  }
  if (data.images && data.images[0]) {
    return data.images[0].url;
  }
  return null;
}

// HEADリクエストで画像URLの有効性チェック
async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { trackId, albumId, aiImageUrl } = req.query;

  // 1. Spotify APIから画像取得
  let imageUrl: string | null = null;
  if (trackId || albumId) {
    imageUrl = await getSpotifyImageUrl(trackId as string, albumId as string);
    if (imageUrl && (await isValidImageUrl(imageUrl))) {
      return res.status(200).json({ imageUrl });
    }
  }

  // 2. AI生成URLの有効性チェック
  if (
    aiImageUrl &&
    typeof aiImageUrl === "string" &&
    (await isValidImageUrl(aiImageUrl))
  ) {
    return res.status(200).json({ imageUrl: aiImageUrl });
  }

  // 3. どちらもダメならダミー画像
  return res.status(200).json({ imageUrl: DUMMY_IMAGE_URL });
}
