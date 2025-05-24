import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  if (!user_id)
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });

  const history = await prisma.recommendationHistory.findMany({
    where: { user_id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(history);
}
