"use client";

import useProblemResults from "@/hooks/useProblemResults";

export default function SubjectiveAnswered() {
  const {
    currentExamResult: { subjectiveAnswered, correctCandidates },
  } = useProblemResults();

  return (
    <>
      {
        <p className="text-lg">
          {correctCandidates?.length && correctCandidates.length > 0
            ? ""
            : `입력한 답 : ${subjectiveAnswered || "답을 입력하지 않았습니다."}`}
        </p>
      }
    </>
  );
}
