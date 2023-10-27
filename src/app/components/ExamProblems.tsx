"use client";
import usePreventClose from "@/hooks/preventClose";
import { ProblemSetWithName } from "@/types/problems";
import { arrayShuffle } from "@/utils/arrayShuffle";
import { useState, useEffect } from "react";
import Button from "./ui/Button";
import candidateNumber from "@/utils/candidateNumber";

type Props = {
  problems: ProblemSetWithName;
};

export default function ExamProblems({ problems }: Props) {
  const { name, exam_problems } = problems;
  const [shuffledExamProblems, setShuffledExamProblems] =
    useState<ProblemSetWithName>({
      name,
      exam_problems: arrayShuffle(exam_problems),
    });

  const { exam_problems: shuffledExamProblemsArray } = shuffledExamProblems;
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

  const currentShuffledExamProblem =
    shuffledExamProblemsArray[currentProblemIndex];

  usePreventClose();

  useEffect(() => {
    console.log("shuffledExamProblems", shuffledExamProblems);
  }, [shuffledExamProblems]);

  if (!currentShuffledExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section>
      <div>문제집 이름 : {name}</div>

      <div className="bg-slate-200 rounded-lg p-3">
        <div className="text-2xl mb-5">
          <span>Q{currentProblemIndex + 1}. </span>
          {currentShuffledExamProblem.question}
        </div>

        {currentShuffledExamProblem.additionalView && (
          <div className="mb-5 border border-black p-3">
            {currentShuffledExamProblem.additionalView}
          </div>
        )}

        {currentShuffledExamProblem.type === "obj" && (
          <>
            {
              <div>
                <ul>
                  {currentShuffledExamProblem.candidates?.map(
                    (candidate, i) => (
                      <li key={i}>
                        {`${candidateNumber(i + 1)} ${candidate.text}`}
                      </li>
                    )
                  )}
                </ul>
              </div>
            }
          </>
        )}

        {currentShuffledExamProblem.type === "sub" && (
          <div>
            <textarea
              className="border border-black rounded-md p-3"
              placeholder="답을 입력하세요."
            ></textarea>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-4">
        <Button
          onClick={() => {
            currentProblemIndex > 0 &&
              setCurrentProblemIndex(currentProblemIndex - 1);
          }}
        >
          이전
        </Button>
        <Button
          onClick={() => {
            currentProblemIndex < shuffledExamProblemsArray.length - 1 &&
              setCurrentProblemIndex(currentProblemIndex + 1);
          }}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
