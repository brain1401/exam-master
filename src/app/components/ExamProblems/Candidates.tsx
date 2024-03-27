"use client";
import { ExamProblem } from "@/types/problems";
import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import checkImage from "../../../../public/images/checkBlack.png";
import useExamProblems from "@/hooks/useExamProblems";
import { twMerge } from "tailwind-merge";
import { checkMarkClassName } from "@/classnames/checkMark";

export default function Candidates() {
  const { currentExamProblem, setCurrentExamProblem } = useExamProblems();

  const onClickCandidate = (i: number, isMultipleAnswer: boolean) => {
    if (!currentExamProblem || !currentExamProblem.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    const newCurrentExamProblems = {
      ...currentExamProblem,
      candidates: [...currentExamProblem.candidates],
    };

    if (!newCurrentExamProblems || !newCurrentExamProblems.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    // 체크를 시도하는 선택지: currentCandidate
    let currentCandidate = { ...[...newCurrentExamProblems.candidates]?.[i] };

    if (
      currentCandidate?.isAnswer === undefined ||
      newCurrentExamProblems?.isAnswerMultiple === undefined ||
      newCurrentExamProblems?.type === undefined ||
      !newCurrentExamProblems?.candidates
    ) {
      throw new Error("무언가가 잘못되었습니다.");
    }
    // 현재 문제가 다중 선택지이면
    if (isMultipleAnswer) {
      // 체크된 선택지의 값을 반전시킨다.
      currentCandidate = {
        ...currentCandidate,
        isAnswer: !currentCandidate.isAnswer,
      };
    } else {
      // 현재 문제가 단일 선택지이면서 이미 체크된 답이 있으면
      if (
        newCurrentExamProblems.candidates.some(
          (candidate) => candidate.isAnswer === true,
        )
      ) {
        // 현재 문제가 단일 선택지이면서 이미 체크된 답이 현재 클릭한 답과 같으면
        if (
          currentCandidate.id ===
          newCurrentExamProblems.candidates.find(
            (candidate) => candidate.isAnswer === true,
          )?.id
        ) {
          currentCandidate = { ...currentCandidate, isAnswer: false };
        }
        // 현재 문제가 단일 선택지이면서 이미 체크된 답이 현재 클릭한 답과 다르면
        else {
          newCurrentExamProblems.candidates =
            newCurrentExamProblems.candidates.map((candidate) => ({
              ...candidate,
              isAnswer: false,
            }));

          currentCandidate = { ...currentCandidate, isAnswer: true };
        }
      } // 현재 문제가 단일 선택지이면서 이미 체크된 답이 없으면
      else {
        currentCandidate = {
          ...currentCandidate,
          isAnswer: !currentCandidate.isAnswer,
        };
      }
    }

    newCurrentExamProblems.candidates = newCurrentExamProblems.candidates.map(
      (candidate) => {
        if (candidate.id === currentCandidate.id) {
          return currentCandidate;
        } else {
          return candidate;
        }
      },
    );

    setCurrentExamProblem(newCurrentExamProblems as NonNullable<ExamProblem>);
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
                  onClick={(e) => {
                    onClickCandidate(
                      i,
                      currentExamProblem.isAnswerMultiple ?? false,
                    );
                  }}
                >
                  <div
                    className={twMerge(
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
