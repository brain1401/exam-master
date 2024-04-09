import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { useEffect, useState } from "react";
import ExamHeader from "../exam/ExamHeader";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamFooter from "../exam/ExamFooter";
import ExamProblem from "../exam/ExamProblem";
import ExamLayout from "../layouts/ExamLayout";

export default function PublicProblemExamPage() {
  const {
    isExamStarted,
    currentPublicExamProblem,
    timeLimit,
    publicExamProblemSet,
    publicExamProblems,
    isRandomSelected,
    isTimeOver,
    setIsTimeOver,
    setPublicExamProblemSet,
    currentPublicExamProblemCandidates,
    setCurrentPublicExamProblem,
    setCurrentPublicExamProblemCandidates,
    setPublicExamProblems,
    setTimeLimit,
    setIsExamStarted,
    setCurrentPublicExamProblemSubAnswer,
    currentExamProblemIndex,
    setCurrentExamProblemIndex,
  } = usePublicProblemExam();

  const questionNumber = currentExamProblemIndex + 1;

  useEffect(() => {
    console.log("isTimeOver :", isTimeOver);
  }, [isTimeOver]);

  useEffect(() => {
    console.log(
      "currentPublicExamProblemCandidates :",
      currentPublicExamProblemCandidates,
    );
  }, [currentPublicExamProblemCandidates]);

  useEffect(() => {
    console.log("publicExamProblems :", publicExamProblems);
  }, [publicExamProblems]);

  return (
    <ExamLayout > 
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
        candidates={currentPublicExamProblemCandidates}
        setCurrentExamProblemCandidates={setCurrentPublicExamProblemCandidates}
        setCurrentExamProblemSubAnswer={setCurrentPublicExamProblemSubAnswer}
      />
      <ExamFooter problemSet={publicExamProblemSet} />
    </ExamLayout>
  );
}
