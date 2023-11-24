"use client";

import useExamProblems from "@/hooks/useExamProblems";

export default function AdditionalView() {
  const { currentExamProblem } = useExamProblems();
  
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
