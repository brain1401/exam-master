import { getProblemSets, getProblemSetsByName } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  if (!session?.user?.email)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );

  const param = req.nextUrl.searchParams;

  const name = param.get("name");
  const page = param.get("page");

  if (!name)
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  const data = await getProblemSetsByName(
    session?.user?.email,
    name,
    page || "1"
  );
  
  return NextResponse.json(data);
}
