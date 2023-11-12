"use client";

import { currentProblemIndexAtom, problemsAtom } from "@/jotai/problems";
import { useAtomValue } from "jotai";

export default function CurrentProblemIndicator() {
  const problems = useAtomValue(problemsAtom);
  const problemCurrentIndex = useAtomValue(currentProblemIndexAtom);

  return (
    <p className="mb-2 text-center text-2xl md:text-3xl">
      {problemCurrentIndex + 1}번째 문제 / 총 {problems.length}개
    </p>
  );
}
