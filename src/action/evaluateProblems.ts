"use server";

import { getAnswerByProblemUuid, postProblemResult, validateExamProblem } from "@/service/problems";
import { getUserByEmail } from "@/service/user";
import { ExamProblem, problemsSchema } from "@/types/problems";
import {
  isAnsweredMoreThanOne,
  isProblemAsnwered,
} from "@/utils/problems";
import { getServerSession } from "next-auth";

export async function evaluateProblems(
  examProblems: ExamProblem[],
  problemSetName: string,
) {
  const session = await getServerSession();

  try {
    const result = await prisma.$transaction(async (pm) => {
      if (!session || !session.user?.email)
        throw new Error("로그인이 필요합니다.");

      const { uuid: userUuid } = await getUserByEmail(session.user.email);

      const validateResult = problemsSchema.safeParse(examProblems);

      if (!validateResult.success) {
        throw new Error("인수로 전달된 문제들이 유효하지 않습니다.");
      }

      const { uuid: resultsUuid } = await pm.result.create({
        data: {
          problemSetName,
          user: {
            connect: {
              uuid: userUuid,
            },
          },
        },
      });

      await Promise.all(
        examProblems.map(async (problem, index) => {
          if (!problem || !problem.uuid) throw new Error("something is null");

          if (!isProblemAsnwered(problem))
            throw new Error("모든 정답을 입력해주세요.");

          if (problem.type === "obj" && problem.isAnswerMultiple === false) {
            if (isAnsweredMoreThanOne(problem)) {
              throw new Error(
                "단일 선택 문제입니다. 하나의 정답만 선택해주세요.",
              );
            }
          }

          if (
            problem.type === "sub" &&
            (problem.subAnswer === "" || problem.subAnswer === null)
          ) {
            throw new Error("주관식 문제입니다. 정답을 입력해주세요.");
          }

          const answer = await getAnswerByProblemUuid(problem.uuid, pm);

          if (!answer) {
            throw new Error("result is null");
          }

          const evaluationResult = await validateExamProblem(problem, answer);

          await postProblemResult(
            index + 1,
            problem,
            resultsUuid,
            evaluationResult,
            answer,
            userUuid,
            pm,
          );
        }),
      );

      return resultsUuid;
    });

    return result;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}
