import { evaluateSubjectiveProblem } from "@/service/evaluateSubjectiveQuestion";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const requestBody = await req.json();

  const question = requestBody.question;
  const answer = requestBody.answer;
  const userAnswer = requestBody.userAnswer;

  if (!question || !answer || !userAnswer) {
    return NextResponse.json(
      { error: "question, answer, userAnswer 중 하나가 비어있습니다." },
      { status: 400 },
    );
  }

  const result = await evaluateSubjectiveProblem({
    answer,
    question,
    userAnswer,
  });

  if (result) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(
      { error: "평가에 실패했습니다." },
      { status: 500 },
    );
  }
}
