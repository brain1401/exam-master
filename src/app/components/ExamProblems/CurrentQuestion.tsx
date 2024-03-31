"use client";

import useExamProblems from "@/hooks/useExamProblems";
import { ExamProblem } from "@/types/problems";

type Props = {
  currentExamProblem: ExamProblem;
};

export default function CurrentQuestion({
  currentExamProblem: { question },
}: Props) {
  const { currentExamProblemIndex } = useExamProblems();
  return (
    <h1 className="whitesh1ace-pre-line mb-5 text-2xl">
      {`${currentExamProblemIndex + 1}. ${question}`}
    </h1>
  );
}
