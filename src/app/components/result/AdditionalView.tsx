"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";

export default function AdditionalView() {
  const {
    currentExamProblemResult: { additionalView },
  } = useExamProblemResults();

  return (
    <>
      {additionalView && (
        <div className="mb-5 border border-black p-3">{additionalView}</div>
      )}
    </>
  );
}
