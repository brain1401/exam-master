"use client";
import { currentExamProblemAtom } from "@/jotai/examProblems";
import { useAtomValue } from "jotai";

export default function AdditionalView() {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);
  return (
    <>
      {currentExamProblem?.additionalView && (
        <div className="mb-5 border border-black p-3">
          {currentExamProblem.additionalView}
        </div>
      )}
    </>
  );
}