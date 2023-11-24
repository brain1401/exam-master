"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";

export default function SubjectiveAnswered() {
  const {
    currentExamProblemResult: { subjectiveAnswered },
  } = useExamProblemResults();

  return (
    <>
      {subjectiveAnswered && (
        <p className="text-lg">{`입력한 답 : ${subjectiveAnswered}`}</p>
      )}
    </>
  );
}
