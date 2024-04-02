"use client";
import { ExamProblem } from "@/types/problems";
import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import checkImage from "../../../public/images/checkBlack.png";
import { checkMarkClassName } from "@/classnames/checkMark";
import useExamProblems from "@/hooks/useExamProblems";
import { cn } from "@/lib/utils";

export default function Candidates() {
  const { currentExamProblem, setCurrentExamProblem } = useExamProblems();

  const onClickCandidate = (i: number, isMultipleAnswer: boolean) => {
    if (!currentExamProblem || !currentExamProblem.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    const newCurrentExamProblem: ExamProblem = {
      ...currentExamProblem,
      candidates: currentExamProblem.candidates.map((candidate, index) => ({
        ...candidate,
        isAnswer: Array.isArray(currentExamProblem.candidates)
          ? index === i
            ? !candidate.isAnswer
            : isMultipleAnswer
              ? candidate.isAnswer
              : false
          : false,
      })),
    };

    setCurrentExamProblem(newCurrentExamProblem);
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
                      `${candidate.isAnswer ? "" : "opacity-0"}`,
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
