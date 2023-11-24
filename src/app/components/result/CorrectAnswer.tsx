"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";
import candidateNumber from "@/utils/candidateNumber";

export default function CorrectAnswer() {
  const {
    currentExamProblemResult: {
      candidates,
      correctCandidates,
      correctSubjectiveAnswer,
    },
  } = useExamProblemResults();

  const answerNumber = (id: number) => {
    const index = candidates?.findIndex((candidate) => candidate.id === id);
    if (index === undefined) throw new Error("index is undefined");
    return index + 1;
  };

  return (
    <>
      {correctCandidates && (
        <ul className="mt-3">
          {correctCandidates.map((correctCandidate) => (
            <li
              key={correctCandidate.id}
              className="text-lg"
            >{`정답 : ${candidateNumber(answerNumber(correctCandidate.id))} ${
              correctCandidate.text
            }`}</li>
          ))}
        </ul>
      )}
      {correctSubjectiveAnswer && (
        <p className="text-lg">{`정답 : ${correctSubjectiveAnswer}`}</p>
      )}
    </>
  );
}
