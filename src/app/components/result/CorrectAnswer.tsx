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
        <div className="mt-3 text-lg">
          {correctCandidates.length > 1 ? (
            <>
              <span>정답 : </span>
              {correctCandidates.map((correctCandidate, index) => (
                <span key={correctCandidate.id + "correntCandidates" + index}>
                  {`${candidateNumber(answerNumber(correctCandidate.id))} ${
                    correctCandidate.text
                  }${index === correctCandidates.length - 1 ? "" : ", "}`}
                </span>
              ))}
            </>
          ) : (
            <p className="text-lg">{`정답 : ${candidateNumber(
              answerNumber(correctCandidates[0].id),
            )} ${correctCandidates[0].text} `}</p>
          )}
        </div>
      )}

      {correctSubjectiveAnswer && (
        <p className="text-lg">{`정답 : ${correctSubjectiveAnswer}`}</p>
      )}
    </>
  );
}
