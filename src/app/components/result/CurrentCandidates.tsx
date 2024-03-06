"use client";

import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import checkImage from "/public/images/checkBlack.png";
import useProblemResults from "@/hooks/useProblemResults";
import { twMerge } from "tailwind-merge";
import { checkMarkClassName } from "@/classnames/checkMark";

export default function CurrentCandidates() {
  const {
    currentExamProblemResult: { candidates },
  } = useProblemResults();


  return (
    <>
      {candidates && (
        <ul>
          {candidates?.map((candidate, index) => (
            <li key={index} className="relative">
              <div
                className={twMerge(
                  `${candidate.isSelected ? "" : "opacity-0"}`,
                  checkMarkClassName,
                )}
              >
                <Image className="" priority src={checkImage} alt="체크" fill />
              </div>
              <div>{`${candidateNumber(index + 1)} ${candidate.text}`}</div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
