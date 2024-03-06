import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  getParsedProblems,
  updateProblems,
  checkUserPermissionForProblemSet,
} from "@/service/problems";
import { problemsSchema, uuidSchema } from "@/types/problems";

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
      { error: "서버로 전송된 데이터가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const isUUIDValidated = uuidSchema.safeParse(problemSetUUID);
  if (!isUUIDValidated.success) {
    return NextResponse.json(
      { error: "UUID가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const validateResult = await checkUserPermissionForProblemSet(
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

  if (!problemsSchema.safeParse(problems).success) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    const result = await updateProblems(
      problemSetsName,
      problems,
      problemSetUUID,
      session.user.email,
    );

    return NextResponse.json(
      result ? true : false,
      result ? { status: 200 } : { status: 500 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "문제를 수정하는 도중 에러가 발생했습니다!" },
      { status: 400 },
    );
  }
}
