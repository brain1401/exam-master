import { evaluateProblems } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  if (!session?.user?.email)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );

  const { examProblems, problemSetName } = await req.json();

  if (!examProblems || !problemSetName) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    const uuid = await evaluateProblems(
      examProblems,
      problemSetName,
      session.user.email,
    );
    return NextResponse.json({ uuid });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
