"use client";

import {
  currentExamProblemIndexAtom,
  examProblemsAtom,
} from "@/jotai/examProblems";
import { Button } from "@nextui-org/react";
import { useAtomValue, useAtom } from "jotai";
export default function ExamProblemsNextOrPrevButtons() {
  const [currentProblemIndex, setCurrentProblemIndex] = useAtom(
    currentExamProblemIndexAtom,
  );
  const examProblems = useAtomValue(examProblemsAtom);
  return (
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
          currentProblemIndex < examProblems.exam_problems.length - 1 &&
            setCurrentProblemIndex(currentProblemIndex + 1);
        }}
      >
        다음
      </Button>
    </div>
  );
}
