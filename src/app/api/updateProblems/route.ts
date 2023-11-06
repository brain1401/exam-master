import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Problem } from "@/types/problems";
import { updateProblems } from "@/service/problems";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }
  if (!session?.user?.email)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );

  const formData = await req.formData();
  const entries = Array.from(formData.entries());

  const intermediateResults: NonNullable<Problem>[] = [];
  let problemSetsName: string | undefined;
  let problemSetUUID: string | undefined;

  for (const [name, value] of entries) {
    if (name === "problemSetsName") {
      problemSetsName = value as string;
      continue;
    }
    if (name === "uuid") {
      problemSetUUID = value as string;
      continue;
    }

    const match = name.match(/(data|image)\[(\d+)\]/);
    if (match) {
      const [, prefix, indexStr] = match;
      const index = parseInt(indexStr);

      if (!intermediateResults[index]) {
        intermediateResults[index] = {} as NonNullable<Problem>;
      }

      if (prefix === "data") {
        const cardData = JSON.parse(value as string);
        intermediateResults[index] = {
          ...intermediateResults[index],
          ...cardData,
        };
      } else if (prefix === "image" && value !== "null") {
        intermediateResults[index].image = value as File;
      }
    }
  }

  if (!problemSetsName || !intermediateResults || !problemSetUUID) {
    return NextResponse.json(
      { error: "문제를 생성하는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }

  const result = await updateProblems(
    problemSetsName,
    intermediateResults,
    problemSetUUID,
    session?.user?.email,
  );

  return NextResponse.json(
    result ? "OK" : "NO",
    result ? { status: 200 } : { status: 500 },
  );
}
