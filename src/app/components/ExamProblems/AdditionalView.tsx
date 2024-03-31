"use client";

import { ExamProblem } from "@/types/problems";

type Props = {
  currentExamProblem: ExamProblem;
};
export default function AdditionalView({
  currentExamProblem: { additionalView },
}: Props) {
  return (
    <>
      {additionalView && (
        <div className="mb-5 border border-black p-3">{additionalView}</div>
      )}
    </>
  );
}
