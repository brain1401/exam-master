"use client";

import useProblemResults from "@/hooks/useProblemResults";

export default function SubjectiveAnswered() {
  const {
    currentExamResult: { subjectiveAnswered },
  } = useProblemResults();

  return (
    <>
      {
        <p className="text-lg">{`입력한 답 : ${subjectiveAnswered || "답을 입력하지 않음."}`}</p>
      }
    </>
  );
}
