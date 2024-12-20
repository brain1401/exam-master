import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { postProblems } from "@/service/problems";
import { UpdateProblemsSetData, problemsSchema } from "@/types/problems";

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

  const data: UpdateProblemsSetData = await req.json();

  const {
    problemSetName,
    problems,
    problemSetIsPublic,
    timeLimit,
    description,
  } = data;

  if (!problemSetName || !problems) {
    return NextResponse.json(
      { error: "서버로 전송된 문제가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    problemsSchema.parse(problems);
  } catch (e) {
    console.log(e);
    console.log(problems);
    return NextResponse.json({ error: e, problems }, { status: 400 });
  }

  // if (!problemSchema.safeParse(problems).success) {
  //   console.log(problems);
  //   return NextResponse.json(
  //     { error: "서버로 전송된 문제 형식이 올바르지 않습니다." },
  //     { status: 400 },
  //   );
  // }

  try {
    const response = await postProblems({
      isPublic: problemSetIsPublic,
      problemSetName: problemSetName,
      toBePostedProblems: problems,
      timeLimit: Number(timeLimit) || 0,
      description: description,
      userEmail: session.user.email,
    });

    return NextResponse.json({ success: response ? "OK" : "FAIL" });
  } catch (e) {
    return NextResponse.json(
      { error: "문제를 업로드 하는 도중 에러가 발생했습니다!" },
      { status: 400 },
    );
  }
}
