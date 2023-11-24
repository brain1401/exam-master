"use client";

import useExamProblems from "@/hooks/useExamProblems";
import { Button } from "@nextui-org/react";
export default function ExamProblemsNextOrPrevButtons() {
  const { examProblems, currentExamProblemIndex, setCurrentExamProblemIndex } =
    useExamProblems();
  return (
    <div className="mt-2 flex gap-4">
      <Button
        onClick={() => {
          currentExamProblemIndex > 0 &&
            setCurrentExamProblemIndex(currentExamProblemIndex - 1);
        }}
      >
        이전
      </Button>
      <Button
        onClick={() => {
          currentExamProblemIndex < examProblems.exam_problems.length - 1 &&
            setCurrentExamProblemIndex(currentExamProblemIndex + 1);
        }}
      >
        다음
      </Button>
    </div>
  );
}
