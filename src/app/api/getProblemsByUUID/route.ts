import { getProblemsSetByUUID } from "@/service/problems";
import { Problem } from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const param = req.nextUrl.searchParams;
  const UUID = param.get("UUID");

  const data:any[] = await getProblemsSetByUUID(
    UUID ?? "",
    session?.user?.email ?? ""
  );

  const result:Partial<Problem>[] = data.map( problem => ({
    type : problem.questionType,
    question : problem.question,
    additionalView : problem.additionalView,
    image : problem.image,
    candidates : problem.candidates,
    subAnswer : problem.subjectiveAnswer,
    isAdditiondalViewButtonClicked : problem.additionalView ? true : false,
    isImageButtonClicked : problem.image ? true : false,
}))
  
  return NextResponse.json(result);
}
