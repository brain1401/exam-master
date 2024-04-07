import { handleEnterKeyPress } from "@/utils/keyboard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Candidate, ExamProblem, ExamProblemSet } from "@/types/problems";
import { useEffect, useState } from "react";
import ExamSubmitButton from "./ExamSubmitButton";
import { useRouter } from "next/navigation";

type Props = {
  problemSet: ExamProblemSet | null;
  setIsExamStarted: (isStarted: boolean) => void;
  setCurrentExamProblemIndex: (index: number) => void;
  setCurrentPublicExamProblemCandidates: (
    candidates: Candidate[] | null,
  ) => void;
  currentExamProblemIndex: number;
  publicExamProblems: ExamProblem[];
};

export default function ExamFooter({
  problemSet,
  publicExamProblems,
  setCurrentExamProblemIndex,
  setCurrentPublicExamProblemCandidates,
  currentExamProblemIndex,
  setIsExamStarted,
}: Props) {


  const router = useRouter();

  const handleEndExam = () => {
    router.push("/");
  };



  return (
    <div className="mt-8 flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0">
      <Button variant="outline" onClick={handleEndExam}>
        시험 종료
      </Button>
      <ExamSubmitButton
        problemSet={problemSet}
        className="mt-0 w-full sm:w-auto"
      />

    </div>
  );
}
