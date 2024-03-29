import { deleteCommentFromProblemSetComment } from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const searchParams = req.nextUrl.searchParams;

  const commentUUID = searchParams.get("commentUUID");

  if (!commentUUID) {
    return NextResponse.json("commentUUID is required", { status: 400 });
  }

  const userUUID = await getUserUUIDbyEmail(session?.user?.email);

  const deletedUUID = await deleteCommentFromProblemSetComment({
    commentUUID,
    userUUID,
  });

  return NextResponse.json(deletedUUID, { status: 200 });
}
