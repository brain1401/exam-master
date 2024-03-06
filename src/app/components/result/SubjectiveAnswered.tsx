"use client";

import useProblemResults from "@/hooks/useProblemResults";

export default function SubjectiveAnswered() {
  const {
    currentExamProblemResult: { subjectiveAnswered },
  } = useProblemResults();

  return (
    <>
      {subjectiveAnswered && (
        <p className="text-lg">{`입력한 답 : ${subjectiveAnswered}`}</p>
      )}
    </>
  );
}
