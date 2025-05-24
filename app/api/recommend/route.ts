import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { emotion } = await req.json();

    // 感情に基づいて曲を推薦
    const songs = [
      {
        title: "RPG",
        artist: "SEKAI NO OWARI",
        image: "https://i.scdn.co/image/ab67616d0000b27345f583929195f7354b713102",
        spotify_url: "https://open.spotify.com/track/3t1wD3uN7GM7bV0aWpsFZQ?si=61e15f2c921f4c78"
      },
      {
        title: "YELL",
        artist: "いきものがかり",
        image: "https://i.scdn.co/image/ab67616d0000b27367c08f5939244114e5f44139",
        spotify_url: "https://open.spotify.com/track/2N8yJV957Glpd7aSOeap7o?si=972044f7444d4321"
      },
      {
        title: "夢を叶えてドラえもん",
        artist: "mao",
        image: "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5e5",
        spotify_url: "https://open.spotify.com/track/3fAN7OH6T38qD9cK2rDqj1?si=f0e30268a6e44285"
      },
      {
        title: "ハピネス",
        artist: "AI",
        image: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd24f7c3e5f5c0c",
        spotify_url: "https://open.spotify.com/track/6C9sNqYs9A7Q8K5g0o9MWE?si=046138b451994712"
      },
      {
        title: "風が吹いている",
        artist: "いきものがかり",
        image: "https://i.scdn.co/image/ab67616d0000b27380019671b94d325142a8855b",
        spotify_url: "https://open.spotify.com/track/3KIV1lN5LUK31BfI0oDrkC?si=1e31dd846d8e46ea"
      }
    ];

    return NextResponse.json({ songs });
  } catch (error: any) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
} 