import { getExamResultsByUUID } from "@/service/problems";
import {
  CorrectCandidate,
  ExamResultCandidate,
  ProblemResult,
} from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  const params = req.nextUrl.searchParams;
  const uuid = params.get("uuid");

  if (!uuid) {
    return NextResponse.json(
      { error: "api 사용법을 확인해주세요" },
      { status: 400 },
    );
  }

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const userEmail = session.user.email;

  try {
    const result = await getExamResultsByUUID(uuid, userEmail);

    const finalResult: ProblemResult[] = result.problemResults.map((r) => {
      return {
        uuid: r.uuid,
        question: r.question,
        questionType: r.questionType as "obj" | "sub",
        additionalView: r.additionalView,
        isCorrect: r.isCorrect,
        candidates: r.candidates as ExamResultCandidate[],
        isAnswerMultiple: r.isAnswerMultiple,
        correctSubjectiveAnswer: r.correctSubjectiveAnswer,
        correctCandidates: r.correctCandidates as CorrectCandidate[],
        subjectiveAnswered: r.subjectiveAnswered,
        image: r.image,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
    return NextResponse.json(finalResult);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
