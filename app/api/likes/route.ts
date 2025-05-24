import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId is required" }, { status: 400 });

  const likes = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(likes);
}

export async function POST(req: Request) {
  const body = await req.json();
  const favorite = await prisma.favorite.create({ data: body });
  return NextResponse.json(favorite);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.favorite.delete({
    where: { id },
  });
  return NextResponse.json({ ok: true });
}
