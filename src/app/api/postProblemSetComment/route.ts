import { insertCommentToProblemSetComment } from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "댓글을 남기려면 먼저 로그인하세요." },
      { status: 401 },
    );
  }
  const reqBody = await req.json();
  console.log({ reqBody });

  const userUUID = await getUserUUIDbyEmail(session.user.email);

  const result = await insertCommentToProblemSetComment({
    problemSetUUID: reqBody.problemSetUUID,
    comment: reqBody.comment,
    userUUID: userUUID,
  });

  return NextResponse.json({ uuid: result });
}
