"use client";

import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import checkImage from "../../../public/images/checkBlack.png";
import useProblemResults from "@/hooks/useProblemResults";
import { checkMarkClassName } from "@/classnames/checkMark";
import { cn } from "@/lib/utils";

export default function CurrentCandidates() {
  const {
    currentExamResult: { candidates },
  } = useProblemResults();


  return (
    <>
      {candidates && (
        <ul>
          {candidates?.map((candidate, index) => (
            <li key={index} className="relative">
              <div
                className={cn(
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
