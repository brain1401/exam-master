"use client";

import useExamProblems from "@/hooks/useExamProblems";

export default function CurrentQuestion() {
  const {
    currentExamProblemIndex,
    currentExamProblem: { question },
  } = useExamProblems();
  return (
    <h1 className="whitesh1ace-pre-line mb-5 text-2xl">
      {`${currentExamProblemIndex + 1}. ${question}`}
    </h1>
  );
}
