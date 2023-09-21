import { checkProblemSetName } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  if(!session?.user?.email)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );


  const params = req.nextUrl.searchParams;
  const name = params.get("name");
  const userEmail = session?.user?.email;

  if (!name)
    return NextResponse.json(
      { error: "api 사용법을 확인해주세요" },
      { status: 400 }
    );
  const result = await checkProblemSetName(name, userEmail);

  return NextResponse.json(result);
}
