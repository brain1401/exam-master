import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getParsedProblems, postProblems } from "@/service/problems";
import { problemsSchema } from "@/types/problems";

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

  const { problemSetsName, problems } = getParsedProblems(formData, false);

  if (!problemSetsName || !problems) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if(!problemsSchema.safeParse(problems).success) {
    return NextResponse.json(
      { error: "서버로 전송된 문제 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }


  const response = await postProblems(
    problemSetsName,
    session?.user?.email,
    problems,
    false,
  );

  return NextResponse.json(response);
}
