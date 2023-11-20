"use client";

import {
  currentExamProblemAtom,
  currentExamProblemIndexAtom,
} from "@/jotai/examProblems";
import { useAtomValue } from "jotai";

export default function CurrentQuestion() {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);
  const currentExamProblemIndex = useAtomValue(currentExamProblemIndexAtom);

  return (
    <p className="mb-5 text-2xl whitespace-pre-line">
      {`${currentExamProblemIndex + 1}. ${
        currentExamProblem?.question ?? "문제가 없습니다."
      }`}
    </p>
  );
}
