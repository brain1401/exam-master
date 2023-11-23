import {
  getProblemsSetByUUID,
  checkUserPermissionForProblemSet,
} from "@/service/problems";
import { ProblemSetWithName, uuidSchema } from "@/types/problems";
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
      { error: "UUID가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const validateResult = await checkUserPermissionForProblemSet(UUID, session.user.email);

  if (validateResult === "NO") {
    return NextResponse.json(
      { error: "본인의 문제만 접근할 수 있습니다." },
      { status: 403 },
    );
  }

  const data = await getProblemsSetByUUID(UUID, session?.user?.email);

  if (data.exam_problems === undefined)
    return NextResponse.json(
      { error: "문제집을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  const result: ProblemSetWithName = {
    id: data.id,
    name: data.name,
    exam_problems: [
      ...data.exam_problems.map((problem) => ({
        type: problem.questionType as "obj" | "sub",
        question: problem.question,
        additionalView: problem.additionalView,
        image: problem.image,
        candidates: problem.candidates,
        subAnswer: problem.subjectiveAnswer,
        isAdditiondalViewButtonClicked: problem.additionalView ? true : false,
        isImageButtonClicked: problem.image ? true : false,
        isAnswerMultiple: problem.isAnswerMultiple,
        id: problem.id,
      })),
    ],
  };

  return NextResponse.json(result);
}
