import { getRandomExamPublicProblemSetByUUID } from "@/service/problems";
import { uuidSchema } from "@/types/problems";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const UUID = param.get("UUID");

  if (!UUID) {
    return NextResponse.json(
      { error: "api 사용법을 확인해주세요" },
      { status: 400 },
    );
  }

  const isUUIDValidated = uuidSchema.safeParse(UUID);

  if (!isUUIDValidated.success) {
    return NextResponse.json(
      { error: "문제 세트 UUID가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const data = await getRandomExamPublicProblemSetByUUID(UUID);

  if (data?.problems === undefined)
    return NextResponse.json(
      { error: "문제집을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );

  if (data.problems.length === 0) {
    return NextResponse.json({ error: "문제가 없습니다." }, { status: 404 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "문제집을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
