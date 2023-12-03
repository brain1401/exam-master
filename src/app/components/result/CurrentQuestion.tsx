"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";
import Image from "next/image";
import WrongMark from "/public/images/wrong.png";
import CorrectMark from "/public/images/correctCircle.png";
import { ReactPortal, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const BASIC_CLASS_NAME = `pointer-events-none absolute z-10 select-none`;

export default function CurrentQuestion() {
  const {
    currentExamProblemResult: { question, isCorrect },
    examProblemResultsIndex: index,
  } = useExamProblemResults();

  const [markPortal, setMarkPortal] = useState<ReactPortal | null>(null);

  useLayoutEffect(() => {
    const process = () => {
      const overlayContainer = document.querySelector(
        "div[data-overlay-container=true]",
      );

      const targetElement = document
        .querySelector("#result-question")
        ?.getBoundingClientRect();


      const [baseTopPosition, baseLeftPosition] = [
        targetElement?.top || 0,
        targetElement?.left || 0,
      ];

      const finalTopPosition = baseTopPosition - 80;
      const finalLeftPosition = baseLeftPosition - 50;

      if (overlayContainer && finalTopPosition) {
        const Mark = isCorrect ? (
          <Image
            priority
            src={CorrectMark}
            alt="맞음"
            style={{
              top: `${finalTopPosition}px`,
              left: `${finalLeftPosition}px`,
            }}
            className={`h-[10rem] w-[10rem] ${BASIC_CLASS_NAME}`}
          />
        ) : (
          <Image
            priority
            src={WrongMark}
            style={{
              top: `${finalTopPosition}px`,
              left: `${finalLeftPosition}px`,
            }}
            alt="틀림"
            className={` ${BASIC_CLASS_NAME}`}
          />
        );

        setMarkPortal(createPortal(Mark, overlayContainer));
      }
    };

    process();

    window.addEventListener("resize", process);

    return () => {
      window.removeEventListener("resize", process);
    };
  }, [isCorrect]);

  return (
    <div>
      <h1
        className="mb-5 whitespace-pre-line text-2xl"
        id="result-question"
      >{`${index + 1}. ${question}`}</h1>
      {markPortal}
    </div>
  );
}
