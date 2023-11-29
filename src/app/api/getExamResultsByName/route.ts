import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getExamResultsByName } from "@/service/problems";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const param = req.nextUrl.searchParams;

  const name = param.get("name");
  const page = param.get("page");

  if (!name)
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  const data = await getExamResultsByName(
    session.user.email,
    name,
    page || "1"
  );

  return NextResponse.json(data);
}