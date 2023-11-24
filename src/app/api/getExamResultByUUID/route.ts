import { getExamResultByUUID } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req:NextRequest) {
  const session = await getServerSession();

  const params = req.nextUrl.searchParams;
  const uuid = params.get("uuid");

  if(!uuid) {
    return NextResponse.json(
      { error: "api 사용법을 확인해주세요" },
      { status: 400 },
    );
  }

  if(!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const userEmail = session.user.email;

  const result = await getExamResultByUUID(uuid, userEmail);

  return NextResponse.json(result);
}