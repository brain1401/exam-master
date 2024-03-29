"use client";

import useProblemResults from "@/hooks/useProblemResults";

export default function AdditionalView() {
  const {
    currentExamProblemResult: { additionalView },
  } = useProblemResults();

  return (
    <>
      {additionalView && (
        <div className="mb-5 border border-black p-3">{additionalView}</div>
      )}
    </>
  );
}
