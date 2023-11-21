import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getParsedProblems, postProblems } from "@/service/problems";

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
      { error: "FormData가 정상적인지 확인하십시오." },
      { status: 500 },
    );
  }

  const response = await postProblems(
    problemSetsName,
    session?.user?.email,
    problems,
  );

  return NextResponse.json(response);
}
