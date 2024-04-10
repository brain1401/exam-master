"use client";
import usePreventClose from "@/hooks/usePreventClose";
import useExamProblems from "@/hooks/useExamProblems";
import { ExamProblemSet } from "@/types/problems";
import { useEffect } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import ExamLayout from "../layouts/ExamLayout";
import ExamHeader from "../exam/ExamHeader";
import ExamProblem from "../exam/ExamProblem";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamFooter from "./ExamFooter";
import { useHydrateAtoms } from "jotai/utils";
import { examProblemSetAtom, isTimeOverAtom } from "@/jotai/examProblems";
import { useExamExternelState } from "@/hooks/useTimeLimit";

type Props = {
  _examProblemSet: ExamProblemSet;
};
export default function LoggedInExamProblems({ _examProblemSet }: Props) {
  useHydrateAtoms([
    [examProblemSetAtom, _examProblemSet],
    [isTimeOverAtom, false],
  ]);

  const {
    currentExamProblem,
    currentExamProblemIndex,
    examProblemSet,
    examProblems,
    isTimeOver,
    setExamProblemsOriginal,
    setExamProblemsRandom,
    setIsTimeOver,
    setExamProblemSet,
    setCurrentExamProblemSubAnswer,
    setCurrentExamProblemCandidates,
    setCurrentExamProblemIndex,
    resetExamProblems,
  } = useExamProblems();

  const { timeLimit, setTimeLimit, isRandomExam, setIsRandomExam } =
    useExamExternelState();

  useEffect(() => {
    setExamProblemSet(_examProblemSet);
    isRandomExam ? setExamProblemsRandom() : setExamProblemsOriginal();
  }, [
    _examProblemSet,
    setExamProblemSet,
    setExamProblemsOriginal,
    setExamProblemsRandom,
    isRandomExam,
  ]);

  useEffect(() => {
    return () => {
      setIsRandomExam(false);
    };
  }, [setIsRandomExam]);

  useEffect(() => {
    setIsTimeOver(false);
  }, [currentExamProblemIndex, setIsTimeOver]);

  useEffect(() => {
    return () => {
      setTimeLimit("0");
    };
  }, [setTimeLimit]);

  useEffect(() => {
    return () => {
      resetExamProblems();
    };
  }, [resetExamProblems]);

  useEffect(() => {
    console.log("examProblemSet :", examProblemSet);
  }, [examProblemSet]);

  useEffect(() => {
    console.log("timeLimit :", timeLimit);
  }, [timeLimit]);

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
        timeLimit={Number(timeLimit)}
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
