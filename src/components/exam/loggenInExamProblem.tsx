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
import ExamFooter from "./ExamFooter";
import { timeLimitAtom } from "@/jotai/publicProblemExam";
type Props = {
  _examProblemSet: ExamProblemSet;
};
export default function LoggedInExamProblems({ _examProblemSet }: Props) {
  useHydrateAtoms([
    [examProblemSetAtom, _examProblemSet],
    [timeLimitAtom, _examProblemSet.timeLimit.toString()],
  ]);

  const {
    currentExamProblem,
    currentExamProblemIndex,
    examProblemSetName,
    examProblemSet,
    currentExamProblemCandidates,
    currentExamProblemSubAnswer,
    timeLimit,
    isTimeOver,
    setIsTimeOver,
    setIsExamStarted,
    setCurrentExamProblemSubAnswer,
    setCurrentExamProblemCandidates,
    setCurrentExamProblem,
    setCurrentExamProblemIndex,
    setExamProblemSetName,
    setExamProblemSet,
    setExamProblems,
    examProblems,
    resetExamProblems,
  } = useExamProblems();

  const { revalidateAllPath } = useRevalidation();

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
        publicExamProblemLength={examProblems?.length ?? 0}
      />
      <ExamProgressBar
        timeLimit={timeLimit}
        isTimeOver={isTimeOver}
        setIsTimeOver={setIsTimeOver}
      />
      <ExamProblem
        candidates={currentExamProblem?.candidates ?? []}
        currentProblem={currentExamProblem ?? ({} as any)}
        questionNumber={currentExamProblemIndex + 1}
        setCurrentExamProblemCandidates={setCurrentExamProblemCandidates}
        setCurrentExamProblemSubAnswer={setCurrentExamProblemSubAnswer}
      />
      <ExamFooter problemSet={examProblemSet} />
    </ExamLayout>
  );
}
