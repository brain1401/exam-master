import { evaluateExamProblems } from "@/service/problems";
import { examProblemsSchema, type ExamProblem } from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const {
    examProblems,
    publicProblemSetUuid,
  }: {
    examProblems: ExamProblem[];
    publicProblemSetUuid: string;
  } = await req.json();

  const userEmail = session?.user?.email;

  if (!examProblems || !publicProblemSetUuid) {
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
      publicProblemSetUuid,
      userEmail ?? undefined,
    );
    return NextResponse.json({ uuid });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
