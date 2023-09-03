import { getProblemsSetByUUID } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const param = req.nextUrl.searchParams;
  const UUID = param.get("UUID");

  const data = await getProblemsSetByUUID(
    UUID ?? "",
    session?.user?.email ?? ""
  );
  return NextResponse.json(data);
}
