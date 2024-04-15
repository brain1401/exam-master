"use client";
import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { useEffect, useState } from "react";
import ExamHeader from "../exam/ExamHeader";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamFooter from "../exam/ExamFooter";
import ExamProblem from "../exam/ExamProblem";
import ExamLayout from "../layouts/ExamLayout";
import CustomError from "../error/CustomError";
import { ExamProblemSet } from "@/types/problems";
import { useHydrateAtoms } from "jotai/utils";
import {
  publicExamProblemSetAtom,
  publicExamProblemsAtom,
  timeLimitAtom,
} from "@/jotai/publicProblemExam";

type Props = {
  publicProblemSet: ExamProblemSet | null;
};
export default function PublicProblemExamPage({ publicProblemSet }: Props) {
  useHydrateAtoms([
    [timeLimitAtom, publicProblemSet?.timeLimit?.toString() || "0"],
    [publicExamProblemsAtom, publicProblemSet?.problems ?? []],
    [publicExamProblemSetAtom, publicProblemSet],
  ]);

  const {
    currentPublicExamProblem,
    timeLimit,
    publicExamProblemSet,
    publicExamProblems,
    isRandomSelected,
    isTimeOver,
    setIsTimeOver,
    currentPublicExamProblemCandidates,
    setCurrentPublicExamProblemCandidates,
    setPublicExamProblemSet,
    setCurrentPublicExamProblemSubAnswer,
    currentExamProblemIndex,
    setPublicExamProblemsRandom,
    setPublicExamProblemsOriginal,
    setCurrentExamProblemIndex,
    resetPublicProblemExam,
  } = usePublicProblemExam();

  useEffect(() => {
    if (publicProblemSet) {
      console.log("publicProblemSet :", publicProblemSet);
      setPublicExamProblemSet(publicProblemSet);
      setCurrentExamProblemIndex(0);
    }
  }, [publicProblemSet, setPublicExamProblemSet, setCurrentExamProblemIndex]);

  useEffect(() => {
    if (isRandomSelected) {
      setPublicExamProblemsRandom();
    } else {
      setPublicExamProblemsOriginal();
    }
  }, [
    isRandomSelected,
    setPublicExamProblemsRandom,
    setPublicExamProblemsOriginal,
  ]);

  const questionNumber = currentExamProblemIndex + 1;

  useEffect(() => {
    return () => {
      resetPublicProblemExam();
    };
  }, [resetPublicProblemExam]);

  if (!currentPublicExamProblem) {
    return <CustomError title="알 수 없는 에러가 발생했습니다." />;
  }

  return (
    <ExamLayout>
      <ExamHeader
        totalProblems={publicExamProblems?.length ?? 0}
        currentExamProblemIndex={currentExamProblemIndex}
        setCurrentExamProblemIndex={setCurrentExamProblemIndex}
        publicExamProblemLength={publicExamProblems?.length ?? 0}
      />
      <ExamProgressBar
        timeLimit={Number(timeLimit) || 0}
        isTimeOver={isTimeOver}
        setIsTimeOver={setIsTimeOver}
      />
      <ExamProblem
        questionNumber={questionNumber}
        currentProblem={currentPublicExamProblem}
        candidates={currentPublicExamProblemCandidates ?? null}
        setCurrentExamProblemCandidates={setCurrentPublicExamProblemCandidates}
        setCurrentExamProblemSubAnswer={setCurrentPublicExamProblemSubAnswer}
      />
      <ExamFooter problemSet={publicExamProblemSet} />
    </ExamLayout>
  );
}
