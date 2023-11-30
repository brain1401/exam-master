"use client";
import { useLayoutEffect } from "react";
import useExamProblems from "@/hooks/useExamProblems";
import { Button } from "@nextui-org/react";
import useScrollEffect from "@/hooks/useScrollEffect";
export default function ExamProblemsNextOrPrevButtons() {
  const { examProblems, currentExamProblemIndex, setCurrentExamProblemIndex } =
    useExamProblems();

  useScrollEffect([currentExamProblemIndex]);

  return (
    <div className="mt-2 flex gap-4">
      <Button
        onClick={() => {
          if (currentExamProblemIndex > 0) {
            setCurrentExamProblemIndex(currentExamProblemIndex - 1);
          }
        }}
      >
        이전
      </Button>
      <Button
        onClick={() => {
          if (currentExamProblemIndex < examProblems.exam_problems.length - 1) {
            setCurrentExamProblemIndex(currentExamProblemIndex + 1);
          }
        }}
      >
        다음
      </Button>
    </div>
  );
}
