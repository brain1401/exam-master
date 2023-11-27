"use client";

import useProblems from "@/hooks/useProblems";

export default function CurrentProblemIndicator() {
  const { problems, currentProblemIndex } = useProblems();

  return (
    <p className="mb-2 text-center text-2xl md:text-3xl">
      {currentProblemIndex + 1}번째 문제 / 총 {problems.length}개
    </p>
  );
}
