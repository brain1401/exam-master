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
      <div className="mt-3 text-lg">
        {
          <p>
            {correctSubjectiveAnswer ? (
              `정답 : ${correctSubjectiveAnswer}`
            ) : (
              <span>
                <span>정답 : </span>
                {correctCandidates?.map((correctCandidate, index) => (
                  <span key={correctCandidate.id + "correntCandidates" + index}>
                    {`${answerNumber(correctCandidate.id)} ${
                      correctCandidate.text
                    }${index === correctCandidates.length - 1 ? "" : ", "}`}
                  </span>
                ))}
              </span>
            )}
          </p>
        }
      </div>
    </>
  );
}
