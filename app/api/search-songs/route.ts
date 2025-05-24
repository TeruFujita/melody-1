import { NextRequest } from "next/server";

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images?: { url: string }[] };
  preview_url: string | null;
  external_urls: { spotify: string };
};

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();

  //spotify トークン取得
  const tokenRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/spotify-token`,
    {
      method: "POST",
    }
  );
  const { access_token } = await tokenRes.json();

  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      keyword
    )}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  // レスポンスのステータスと内容を確認
  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    console.error('Spotify API error:', searchRes.status, errorText);
    return Response.json(
      { error: 'Spotify APIリクエストに失敗しました', details: errorText },
      { status: 500 }
    );
  }

  const searchData = await searchRes.json();

  if (!searchData.tracks || !Array.isArray(searchData.tracks.items)) {
    console.error('Spotify APIレスポンス不正:', searchData);
    return Response.json(
      { error: 'Spotify APIから曲情報が取得できませんでした', details: searchData },
      { status: 500 }
    );
  }

  const tracks = (searchData.tracks.items as SpotifyTrack[]).map((item) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((artist) => artist.name).join(", "),
    image: item.album.images?.[0]?.url,
    preview_url: item.preview_url,
    spotify_url: item.external_urls.spotify,
  }));

  return Response.json({ tracks });
}
