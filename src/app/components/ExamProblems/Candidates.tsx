"use client";
import { ExamProblem, ExamProblemAnswer } from "@/types/problems";
import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import checkImage from "../../../../public/images/checkBlack.png";
import { checkMarkClassName } from "@/classnames/checkMark";
import useExamProblems from "@/hooks/useExamProblems";
import { cn } from "@/lib/utils";

type Props = {
  currentExamProblem: ExamProblem;
};

export default function Candidates({ currentExamProblem }: Props) {
  const { currentExamProblemAnswer, setCurrentExamProblemAnswer } =
    useExamProblems();

  const onClickCandidate = (i: number, isMultipleAnswer: boolean) => {
    if (!currentExamProblem || !currentExamProblem.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    const newCurrentExamProblemAnswer: ExamProblemAnswer = {
      uuid: currentExamProblem.uuid ?? "",
      answer: Array.isArray(currentExamProblemAnswer?.answer)
        ? [...currentExamProblemAnswer.answer]
        : currentExamProblem.candidates.map((candidate) => ({
            ...candidate,
            isAnswer: false,
          })),
    };

    const candidate = currentExamProblem.candidates[i];

    // 현재 문제가 다중 선택지이면
    if (isMultipleAnswer) {
      if (Array.isArray(newCurrentExamProblemAnswer.answer)) {
        newCurrentExamProblemAnswer.answer[i] = {
          ...candidate,
          isAnswer: !newCurrentExamProblemAnswer.answer[i]?.isAnswer,
        };
      }
    } else {
      // 현재 문제가 단일 선택지이면
      if (Array.isArray(newCurrentExamProblemAnswer.answer)) {
        newCurrentExamProblemAnswer.answer =
          newCurrentExamProblemAnswer.answer.map((answer, index) => ({
            ...answer,
            isAnswer: index === i,
          }));
      }
    }

    setCurrentExamProblemAnswer(newCurrentExamProblemAnswer);
  };

  return (
    <>
      {currentExamProblem?.candidates && (
        <div>
          <ul>
            {currentExamProblem.candidates.map((candidate, i) => (
              <li key={i} className="flex">
                <div
                  className="relative cursor-pointer select-none md:hover:font-bold"
                  onClick={() =>
                    onClickCandidate(
                      i,
                      currentExamProblem.isAnswerMultiple ?? false,
                    )
                  }
                >
                  <div
                    className={cn(
                      `${
                        Array.isArray(currentExamProblemAnswer?.answer) &&
                        currentExamProblemAnswer.answer[i]?.isAnswer
                          ? ""
                          : "opacity-0"
                      }`,
                      checkMarkClassName,
                    )}
                  >
                    <Image src={checkImage} alt="체크" fill priority />
                  </div>
                  <p>{`${candidateNumber(i + 1)} ${candidate.text}`}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
