import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  updateProblems,
  checkUserPermissionForProblemSet,
} from "@/service/problems";
import {
  UpdateProblemsSetData,
  problemsSchema,
  uuidSchema,
} from "@/types/problems";

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const data: UpdateProblemsSetData = await req.json();

  const {
    problemSetName,
    problems,
    problemSetIsPublic,
    problemSetUUID,
    timeLimit,
    description,
  } = data;

  console.log("getParsedProblems(formData, true) 후");

  if (!problemSetName || !problems || !problemSetUUID) {
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

  console.log("problems :", problems);

  try {
    const result = await updateProblems({
      problemSetName,
      replacingProblems: problems,
      problemSetUUID,
      description,
      timeLimit: Number(timeLimit) || 0,
      problemSetIsPublic,
      userEmail: session.user.email,
    });

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
