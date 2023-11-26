import { getExamResults } from "@/service/problems";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "로그인을 해주세요!" }, { status: 401 });
  }

  try {
    const results = await getExamResults(session.user.email, "1");
    return NextResponse.json(results);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
