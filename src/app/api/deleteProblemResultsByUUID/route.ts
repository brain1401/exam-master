import { deleteProblemResults } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {uuids} = await req.json();

  console.log("uuids :", uuids);

  const result = await deleteProblemResults(uuids, session.user.email);

  return NextResponse.json(
    { message: result === true ? "성공적으로 삭제되었습니다." : "삭제에 실패했습니다."},
    { status: result === true ? 200 : 500 },
  );
}
