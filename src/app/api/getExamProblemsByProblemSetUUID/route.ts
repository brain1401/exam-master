import { getProblemsSetByUUID } from "@/service/problems";
import { ExamProblemSet } from "@/types/problems";
import { problemShuffle } from "@/utils/problemShuffle";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const param = req.nextUrl.searchParams;
  const UUID = param.get("UUID");

  if (!UUID || !session?.user?.email)
    return NextResponse.json(
      { error: "api 사용법을 확인해주세요" },
      { status: 400 },
    );

  const data = await getProblemsSetByUUID(UUID, session?.user?.email);

  if (data.exam_problems === undefined)
    return NextResponse.json(
      { error: "문제집을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );

    const examProblems =  [
      ...data.exam_problems.map((problem) => ({
        id: problem.id,
        type: problem.questionType as "obj" | "sub",
        question: problem.question,
        additionalView: problem.additionalView,
        image: problem.image,
        isAnswerMultiple: problem.isAnswerMultiple,
        // 문제의 정답을 알 수 없게 함
        candidates:
          problem.candidates?.map((candidate) => ({
            id: candidate.id,
            text: candidate.text,
            isAnswer: false,
          })) ?? null,

        // 문제의 정답을 알 수 없게 함
        subAnswer: "",
      })),
    ];

  const result: ExamProblemSet = {
    name: data.name,
    exam_problems: problemShuffle(examProblems),
  };

  return NextResponse.json(result);
}
