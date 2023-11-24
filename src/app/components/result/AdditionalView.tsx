"use client";
import { currentExamProblemResultAtom } from "@/jotai/examProblemResult";
import { useAtomValue } from "jotai";
export default function AdditionalView() {
  const { additionalView } = useAtomValue(currentExamProblemResultAtom);

  return (
    <>
      {additionalView && (
        <div className="mb-5 border border-black p-3">
          {additionalView}
        </div>
      )}
    </>
  );
}
