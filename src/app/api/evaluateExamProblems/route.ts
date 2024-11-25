import { evaluateExamProblems } from "@/service/problems";
import { ExamProblem, examProblemsSchema } from "@/types/problems";
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
    examProblems,
    examProblemSetName,
  }: {
    examProblems: ExamProblem[];
    examProblemSetName: string;
  } = await req.json();

  console.log("examProblems", examProblems);
  console.log("problemSetName", examProblemSetName);

  if (!examProblems || !examProblemSetName) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if (examProblemsSchema.safeParse(examProblems).success === false) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    const uuid = await evaluateExamProblems(
      examProblems,
      examProblemSetName,
      session.user.email,
    );
    return NextResponse.json({ uuid });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
