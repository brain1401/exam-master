import { evaluateProblems } from "@/service/problems";
import { ExamProblem, ExamProblemAnswer } from "@/types/problems";
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

  const {
    examProblemAnswers,
    examProblems,
    problemSetName,
  }: {
    examProblemAnswers: ExamProblemAnswer[];
    examProblems: ExamProblem[];
    problemSetName: string;
  } = await req.json();

  console.log("examProblemAnswers", examProblemAnswers);
  console.log("examProblems", examProblems);
  console.log("problemSetName", problemSetName);

  if (!examProblemAnswers || !problemSetName) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    const uuid = await evaluateProblems(
      examProblemAnswers,
      examProblems,
      problemSetName,
      session.user.email,
    );
    return NextResponse.json({ uuid });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
