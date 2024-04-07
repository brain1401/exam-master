import {
  getProblemsSetByUUID,
  checkUserPermissionForProblemSet,
} from "@/service/problems";
import { ExamProblem, ExamProblemSet, uuidSchema } from "@/types/problems";
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

  const isUUIDValidated = uuidSchema.safeParse(UUID);
  if (!isUUIDValidated.success) {
    return NextResponse.json(
      { error: "문제 세트 UUID가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const validateResult = await checkUserPermissionForProblemSet(
    UUID,
    session.user.email,
  );

  if (validateResult === "NO") {
    return NextResponse.json(
      { error: "본인의 문제만 가져올 수 있습니다." },
      { status: 403 },
    );
  }

  const data = await getProblemsSetByUUID(UUID, session?.user?.email);

  if (data?.problems === undefined)
    return NextResponse.json(
      { error: "문제집을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );

  const examProblems: ExamProblem[] = data.problems.map((problem) => {
    if (!problem) throw new Error("문제가 없습니다.");

    return {
      order: problem.order,
      uuid: problem.uuid ?? "",
      type: problem.type as "obj" | "sub",
      question: problem.question,
      additionalView: problem.additionalView,
      image: problem.image ? problem.image : null,
      isAnswerMultiple: problem.isAnswerMultiple,
      // 문제의 정답을 알 수 없게 함
      candidates:
        problem.candidates?.map((candidate) => ({
          id: candidate.id,
          text: candidate.text,
          isAnswer: false,
        })) ?? null,

      // 문제의 정답을 알 수 없게 함
      subAnswer: problem.type === "sub" ? "" : null,
    };
  });

  const result: ExamProblemSet = {
    uuid: data.uuid,
    name: data.name,
    description: data.description ?? "",
    updatedAt: new Date(),
    creator: data.userName,
    timeLimit: data.timeLimit || 0,
    problems: problemShuffle(examProblems),
  };

  return NextResponse.json(result);
}
