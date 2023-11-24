"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";
import Image from "next/image";
import WrongMark from "/public/images/wrong.png";
import CorrectMark from "/public/images/correctCircle.png";
export default function CurrentQuestion() {
  const {
    currentExamProblemResult: { question, isCorrect },
    examProblemResultsIndex: index,
  } = useExamProblemResults();

  const Mark = () => {
    return isCorrect ? (
      <Image
        src={CorrectMark}
        alt="맞음"
        className="absolute left-[-5rem] top-[-5rem] h-[10rem] w-[10rem] select-none pointer-events-none z-10"
      />
    ) : (
      <Image
        src={WrongMark}
        alt="틀림"
        className="absolute left-[-5rem] top-[-4rem] select-none pointer-events-none z-10"
      />
    );
  };

  return (
    <div className="relative">
      <Mark />
      <h1 className="mb-5 whitespace-pre-line text-2xl">{`${
        index + 1
      }. ${question}`}</h1>
    </div>
  );
}
