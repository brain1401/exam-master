import { getPublicExamProblemResult } from "@/service/problems";
import { ProblemResult } from "@/types/problems";
import { isValidUUID } from "@/utils/problems";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const UUID = searchParams.get("UUID");

  if (!UUID) {
    return NextResponse.json(
      { error: "API 사용법을 확인해주세요" },
      { status: 400 },
    );
  }

  if (!isValidUUID(UUID)) {
    return NextResponse.json(
      { error: "올바른 UUID가 아닙니다" },
      { status: 400 },
    );
  }

  const result = await getPublicExamProblemResult(UUID);

  if (!result) {
    return NextResponse.json(
      { error: "해당 문제를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const finalResult: ProblemResult[] = result.problemResults.map((r) => {
    return {
      uuid: r.uuid,
      question: r.question,
      questionType: r.questionType as "obj" | "sub",
      additionalView: r.additionalView,
      isCorrect: r.isCorrect,
      candidates: r.candidates,
      isAnswerMultiple: r.isAnswerMultiple,
      correctSubjectiveAnswer: r.correctSubjectiveAnswer,
      correctCandidates: r.correctCandidates,
      subjectiveAnswered: r.subjectiveAnswered,
      image: r.image,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  });

  return NextResponse.json(finalResult);
}
