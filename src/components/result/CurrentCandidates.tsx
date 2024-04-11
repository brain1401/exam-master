"use client";

import candidateNumber from "@/utils/candidateNumber";
import CheckSVG from "../../../public/images/checkBlack.svg";
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
              <CheckSVG
                className={cn(
                  `${candidate.isSelected ? "" : "opacity-0"}`,
                  checkMarkClassName,
                )}
                priority
                src={CheckSVG}
                alt="체크"
              />
              <div>{`${candidateNumber(index + 1)} ${candidate.text}`}</div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
