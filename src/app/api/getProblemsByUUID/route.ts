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

  const validateResult = await checkUserPermissionForProblemSet(
    UUID,
    session.user.email,
  );

  if (validateResult === "NO") {
    return NextResponse.json(
      { error: "본인의 문제만 접근할 수 있습니다." },
      { status: 403 },
    );
  }

  const data = await getProblemsSetByUUID(UUID, session?.user?.email);


  const result: ProblemSetWithName = {
    id: data.uuid.toString(),
    name: data.name,
    isPublic: data.isPublic,
    description: data.description ?? "",
    problems: data.problems,
  };

  return NextResponse.json(result);
}
