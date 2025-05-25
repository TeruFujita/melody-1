import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    if (!user_id)
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });

    const likes = await prisma.favorite.findMany({
      where: { user_id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(likes);
  } catch (error: any) {
    console.error("Likes GET Error:", error);
    return NextResponse.json({
      error: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received likes data:", body);

    // 必須フィールドの検証
    const requiredFields = ["user_id", "sourceType", "sourceId", "songTitle", "songArtist", "songImageUrl", "spotifyUrl"];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: "Missing required fields",
        missingFields
      }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({ data: body });
    return NextResponse.json(favorite);
  } catch (error: any) {
    console.error("Likes POST Error:", error);
    return NextResponse.json({
      error: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Likes DELETE Error:", error);
    return NextResponse.json({
      error: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
