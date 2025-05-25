import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  if (!user_id)
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });

  const likes = await prisma.favorite.findMany({
    where: { user_id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(likes);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const favorite = await prisma.favorite.create({ data: body });
    return NextResponse.json(favorite);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.favorite.delete({
    where: { id },
  });
  return NextResponse.json({ ok: true });
}
