"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";

export default function CurrentQuestion() {
  const {
    currentExamProblemResult: { question },
    examProblemResultsIndex: index,
  } = useExamProblemResults();

  return (
    <>
      <h1 className="mb-5 whitespace-pre-line text-2xl">{`${
        index + 1
      }. ${question}`}</h1>
    </>
  );
}
