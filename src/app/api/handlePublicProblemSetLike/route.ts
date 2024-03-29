import { handlePublicProblemLikes } from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }
  const userUUID = await getUserUUIDbyEmail(session.user.email);

  const data: {
    problemSetUUID: string;
    liked: boolean;
  } = await req.json();

  const result = await handlePublicProblemLikes({
    problemSetUUID: data.problemSetUUID,
    userUUID,
    liked: data.liked,
  });

  return NextResponse.json(result);
}
