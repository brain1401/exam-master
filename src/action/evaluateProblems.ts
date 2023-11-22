"use server";

import {
  createExamResult,
  getAnswerByProblemId,
  isAnsweredMoreThanOne,
  isProblemAsnwered,
  postExamProblemResult,
  validateExamProblem,
} from "@/service/problems";
import { getUser } from "@/service/user";
import { Problem, problemsSchema } from "@/types/problems";
import { getServerSession } from "next-auth";

export async function evaluateProblems(
  examProblems: Problem[],
  problemSetId: number,
) {
  const session = await getServerSession();

  if (!session || !session.user?.email)
    return { error: "로그인이 필요합니다." };

  const userId = (await getUser(session.user.email)).id;

  const postedIds = [];

  const validateResult = problemsSchema.safeParse(examProblems);

  if (!validateResult.success) {
    return validateResult.error.format();
  }
  for (const problem of examProblems) {
    if (!problem || !problem.id) throw new Error("something is null");

    if (!isProblemAsnwered(problem)) return { error: "정답을 입력해주세요." };

    if (problem.type === "obj" && problem.isAnswerMultiple === false) {
      if (isAnsweredMoreThanOne(problem)) {
        return { error: "단일 선택 문제입니다. 하나의 정답만 선택해주세요." };
      }
    }

    if (
      problem.type === "sub" &&
      (problem.subAnswer === "" || problem.subAnswer === null)
    ) {
      return { error: "주관식 문제입니다. 정답을 입력해주세요." };
    }

    const answer = await getAnswerByProblemId(problem.id);

    if (!answer) {
      throw new Error("result is null");
    }

    const evaluationResult = await validateExamProblem(problem);

    console.log(evaluationResult);

    const postedId = await postExamProblemResult(
      problem.id,
      evaluationResult,
      userId,
    );

    postedIds.push(postedId);
  }

  const createdExamResultId = await createExamResult(postedIds, problemSetId, userId);

  return createdExamResultId;
}
