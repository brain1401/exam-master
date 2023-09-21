import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Problem } from "@/types/problems";
import { postProblems } from "@/service/problems";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  if (!session?.user?.email)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );

  const formData = await req.formData();
  const entries = Array.from(formData.entries());

  const intermediateResults: NonNullable<Problem>[] = [];
  let problemSetName: string | undefined;

  for (const [name, value] of entries) {
    if (name === "problemSetName") {
      problemSetName = value as string;
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

  if(!problemSetName || !intermediateResults) {
    return NextResponse.json(
      { error: "FormData가 정상적인지 확인하십시오." },
      { status: 500 }
    );
  }

  const response = await postProblems(
    problemSetName,
    session?.user?.email,
    intermediateResults
  );

  return NextResponse.json(response);
}
