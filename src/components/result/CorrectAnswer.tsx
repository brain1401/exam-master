"use client";

import useProblemResults from "@/hooks/useProblemResults";
import candidateNumber from "@/utils/candidateNumber";

export default function CorrectAnswer() {
  const {
    currentExamResult: {
      candidates,
      correctCandidates,
      correctSubjectiveAnswer,
    },
  } = useProblemResults();

  const answerNumber = (id: number) => {
    if (!candidates) return "";
    const index = candidates.findIndex((candidate) => candidate.id === id);
    if (index === -1) return "";
    return candidateNumber(index + 1);
  };

  return (
    <>
      {correctCandidates && correctCandidates.length > 0 && (
        <div className="mt-3 text-lg">
          {correctCandidates.length > 1 ? (
            <>
              <span>정답 : </span>
              {correctCandidates.map((correctCandidate, index) => (
                <span key={correctCandidate.id + "correntCandidates" + index}>
                  {`${answerNumber(correctCandidate.id)} ${
                    correctCandidate.text
                  }${index === correctCandidates.length - 1 ? "" : ", "}`}
                </span>
              ))}
            </>
          ) : (
            <p className="text-lg">{`정답 : ${answerNumber(correctCandidates[0].id)} ${correctCandidates[0].text} `}</p>
          )}
        </div>
      )}
    </>
  );
}
