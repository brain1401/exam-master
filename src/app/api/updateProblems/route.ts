import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  getParsedProblems,
  updateProblems,
  validateProblemSetUUID,
} from "@/service/problems";
import { problemsSchema } from "@/types/problems";

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }
  const formData = await req.formData();

  const { problemSetsName, problems, problemSetUUID } = getParsedProblems(
    formData,
    true,
  );

  if (!problemSetsName || !problems || !problemSetUUID) {
    return NextResponse.json(
      { error: "문제를 업데이트하는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }

  const validateResult = await validateProblemSetUUID(
    problemSetUUID,
    session.user.email,
  );

  if (validateResult === "NO")
    return NextResponse.json(
      { error: "본인의 문제만 수정할 수 있습니다!" },
      {
        status: 401,
      },
    );

  console.log(problemsSchema.safeParse(problems).success);
  console.log(problems);
  if (!problemsSchema.safeParse(problems).success) {
    return NextResponse.json(
      { error: "문제 형식이 올바르지 않습니다." },
      { status: 500 },
    );
  }

  const result = await updateProblems(
    problemSetsName,
    problems,
    problemSetUUID,
    session?.user?.email,
  );

  return NextResponse.json(
    result ? "OK" : "NO",
    result ? { status: 200 } : { status: 500 },
  );
}
