"use client";

import useProblemResults from "@/hooks/useProblemResults";
import Image from "next/image";
import WrongMark from "../../../public/images/wrong.png";
import CorrectMark from "../../../public/images/correctCircle.png";

export default function CurrentQuestion() {
  const {
    currentExamResult: { question, isCorrect },
    currentExamResultIndex: index,
  } = useProblemResults();

  return (
    <div className="relative pointer-events-none">
      <Image
        className="absolute top-[-7rem] left-[-5rem]"
        width={200}
        height={200}
        priority
        src={isCorrect ? CorrectMark : WrongMark}
        alt={isCorrect ? "정답 표시" : "오답 표시"}
      />
      <h1
        className="mb-5 whitespace-pre-line text-2xl"
        id="result-question"
      >{`${index + 1}. ${question}`}</h1>
    </div>
  );
}
