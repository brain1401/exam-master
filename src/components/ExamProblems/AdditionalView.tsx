"use client";

import useExamProblems from "@/hooks/useExamProblems";

export default function AdditionalView() {
  const {
    currentExamProblem: { additionalView },
  } = useExamProblems();
  return (
    <>
      {additionalView && (
        <div className="mb-5 border border-black p-3">{additionalView}</div>
      )}
    </>
  );
}
