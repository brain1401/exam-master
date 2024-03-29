import { getPublicProblemLikes } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const session = await getServerSession();

  const problemSetUUID = params.get("problemSetUUID");
  if (!problemSetUUID) {
    return NextResponse.json(
      { error: "problemSetUUID is required" },
      { status: 400 },
    );
  }
  const { liked, likes } = await getPublicProblemLikes(
    problemSetUUID,
    session?.user?.email,
  );

  return NextResponse.json({ liked, likes });
}
