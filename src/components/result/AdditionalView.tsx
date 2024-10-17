"use client";

import useProblemResults from "@/hooks/useProblemResults";

export default function AdditionalView() {
  const {
    currentExamResult: { additionalView },
  } = useProblemResults();

  return (
    <>
      {additionalView && (
        <div className="mb-5 whitespace-pre-line border border-black p-3">
          {additionalView}
        </div>
      )}
    </>
  );
}
