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
import { ExamProblem, Problem, problemsSchema } from "@/types/problems";
import { getServerSession } from "next-auth";

export async function evaluateProblems(
  examProblems: ExamProblem[],
  problemSetName: string,
) {
  const session = await getServerSession();

  if (!session || !session.user?.email)
    throw new Error("로그인이 필요합니다.");

  const userId = (await getUser(session.user.email)).id;

  const postedIds = [];

  const validateResult = problemsSchema.safeParse(examProblems);

  if (!validateResult.success) {
    throw new Error("인수로 전달된 문제들이 유효하지 않습니다.");
  }
  for (const problem of examProblems) {
    if (!problem || !problem.id) throw new Error("something is null");

    if (!isProblemAsnwered(problem)) throw new Error("모든 정답을 입력해주세요.");

    if (problem.type === "obj" && problem.isAnswerMultiple === false) {
      if (isAnsweredMoreThanOne(problem)) {
        throw new Error("단일 선택 문제입니다. 하나의 정답만 선택해주세요.");
      }
    }

    if (
      problem.type === "sub" &&
      (problem.subAnswer === "" || problem.subAnswer === null)
    ) {
      throw new Error("주관식 문제입니다. 정답을 입력해주세요.");
    }

    const answer = await getAnswerByProblemId(problem.id);

    if (!answer) {
      throw new Error("result is null");
    }

    const evaluationResult = await validateExamProblem(problem, answer);

    const postedId = await postExamProblemResult(
      problem,
      evaluationResult,
      answer,
      userId,
    );

    postedIds.push(postedId);
  }

  const createdExamResultId = await createExamResult(
    postedIds,
    problemSetName,
    userId,
  );

  return createdExamResultId;
}
