import { getProblemSets } from "@/service/card";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const data = await getProblemSets(session?.user?.email ?? "");
  return NextResponse.json(data);
}
