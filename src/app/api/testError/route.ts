import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  throw new Error("에러 발생시키기");
  
  return NextResponse.json({ message: "error test" }, { status: 400 });
}