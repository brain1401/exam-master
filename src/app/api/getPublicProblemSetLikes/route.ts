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
  const result = await getPublicProblemLikes(
    problemSetUUID,
    session?.user?.email,
  );

  if (!result) {
    return NextResponse.json(
      {
        liked: null,
        likes: null,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ liked: result.liked, likes: result.likes });
}
