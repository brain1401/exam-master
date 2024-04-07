"use client";
import usePreventClose from "@/hooks/usePreventClose";
import useExamProblems from "@/hooks/useExamProblems";
import { ExamProblemSet } from "@/types/problems";
import { useEffect, useState } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { useHydrateAtoms } from "jotai/utils";
import { examProblemSetAtom } from "@/jotai/examProblems";
import ExamLayout from "../layouts/ExamLayout";
import ExamHeader from "../exam/ExamHeader";
import ExamProblem from "../exam/ExamProblem";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamSubmitButton from "../exam/ExamSubmitButton";
import ExamFooter from "./ExamFooter";
type Props = {
  _examProblemSet: ExamProblemSet;
};
export default function LoggedInExamProblems({ _examProblemSet }: Props) {
  useHydrateAtoms([[examProblemSetAtom, _examProblemSet]]);

  const {
    currentExamProblem,
    currentExamProblemIndex,
    examProblemSetName,
    examProblemSet,
    currentExamProblemCandidates,
    currentExamProblemSubAnswer,
    setCurrentExamProblemSubAnswer,
    setCurrentExamProblemCandidates,
    setCurrentExamProblem,
    setCurrentExamProblemIndex,
    setExamProblemSetName,
    setExamProblemSet: setExamProblemSets,
    setExamProblems,
    examProblems,
    resetExamProblems,
  } = useExamProblems();
  const { revalidateAllPath } = useRevalidation();

  const [isTimeOver, setIsTimeOver] = useState(false);

  useEffect(() => {
    console.log("examProblemSet :", examProblemSet);
  }, [examProblemSet]);

  useEffect(() => {
    // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
    revalidateAllPath();

    return () => {
      resetExamProblems();
    };
  }, [revalidateAllPath, resetExamProblems]);

  usePreventClose();

  return (
    <ExamLayout>
      <ExamHeader
        totalProblems={examProblems?.length ?? 0}
        currentExamProblemIndex={currentExamProblemIndex}
        setCurrentExamProblemIndex={setCurrentExamProblemIndex}
      />
      <ExamProgressBar
        timeLimit={examProblemSet.timeLimit}
        isTimeOver={isTimeOver}
        setIsTimeOver={setIsTimeOver}
      />
      <ExamProblem
        candidates={currentExamProblem?.candidates}
        currentProblem={currentExamProblem}
        questionNumber={currentExamProblemIndex + 1}
        setCurrentExamProblemCandidates={setCurrentExamProblemCandidates}
        setCurrentExamProblemSubAnswer={setCurrentExamProblemSubAnswer}
      />
      <ExamFooter
        currentExamProblemIndex={currentExamProblemIndex}
        problemSet={examProblemSet}
        publicExamProblems={examProblems}
        setCurrentExamProblemIndex={setCurrentExamProblemIndex}
        setCurrentPublicExamProblemCandidates={setCurrentExamProblemCandidates}
        setIsExamStarted={setIsTimeOver}
      />
    </ExamLayout>
  );
}
