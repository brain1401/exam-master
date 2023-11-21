"use server";

import { getAnswerByProblemId } from "@/service/problems";
import { Problem, problemsSchema } from "@/types/problems";

export async function evaluateProblems(examProblems: Problem[]) {
  const finalResult = [];

  const validateResult = problemsSchema.safeParse(examProblems);

  if(!validateResult.success) {
    return validateResult.error.format();
  }
  for (const problem of examProblems) {
    if (!problem || !problem.id) throw new Error("something is null");

    const isAnswered =
      problem.type === "obj"
        ? problem.candidates?.some((candidate) => candidate.isAnswer)
        : problem.subAnswer !== null && problem.subAnswer !== "";

    if (!isAnswered) {
      return "정답을 입력해주세요.";
    }

    if (problem.type === "obj" && problem.isAnswerMultiple === false) {
      if (!problem.candidates) throw new Error("candidates is null");

      const isAnsweredMoreThanOne =
        problem.candidates.filter((candidate) => candidate.isAnswer).length > 1;

      if (isAnsweredMoreThanOne) {
        return "단일 선택 문제입니다. 하나의 정답만 선택해주세요.";
      }
    }

    if (
      problem.type === "sub" &&
      (problem.subAnswer === "" || problem.subAnswer === null)
    ) {
      return "주관식 문제입니다. 정답을 입력해주세요.";
    }

    const answer = await getAnswerByProblemId(problem.id);

    if (!answer) throw new Error("result is null");

    if (problem.type === "obj") {
      if (!problem.candidates) throw new Error("candidates is null");

      const answeredId = problem.candidates
        .filter((candidate) => candidate.isAnswer)
        .map((candidate) => candidate.id);

      const isCorrect =
        isAnswerArray(answer) &&
        answer.every((id) => {
          return answeredId.includes(id);
        });

      finalResult.push(isCorrect);
    } else if (problem.type === "sub") {
      if (!problem.subAnswer) throw new Error("subAnswer is null");

      const isCorrect = problem.subAnswer === answer;

      finalResult.push(isCorrect);
    }
  }

  return finalResult;
}

function isAnswerString(answer: string | (number | null)[]): answer is string {
  return typeof answer === "string";
}

function isAnswerArray(
  answer: string | (number | null)[],
): answer is (number | null)[] {
  return Array.isArray(answer);
}
