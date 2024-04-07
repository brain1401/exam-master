import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { useEffect, useState } from "react";
import ExamHeader from "../exam/ExamHeader";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamFooter from "../exam/ExamFooter";
import ExamProblem from "../exam/ExamProblem";
import { PublicExamProblemSet } from "@/types/problems";
import ExamLayout from "../layouts/ExamLayout";
import { problemShuffle } from "@/utils/problemShuffle";

type Props = {
  problemSetTimeLimit: number;
  publicProblemSet: PublicExamProblemSet | null;
};

export default function PublicProblemExamPage({
  problemSetTimeLimit,
  publicProblemSet,
}: Props) {
  const {
    isExamStarted,
    currentPublicExamProblem,
    timeLimit,
    publicExamProblemSet,
    publicExamProblems,
    isRandomSelected,
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

  const [isTimeOver, setIsTimeOver] = useState(false);
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
        candidates={currentPublicExamProblemCandidates}
        setCurrentExamProblemCandidates={setCurrentPublicExamProblemCandidates}
        setCurrentExamProblemSubAnswer={setCurrentPublicExamProblemSubAnswer}
      />
      <ExamFooter problemSet={publicExamProblemSet} />
    </ExamLayout>
  );
}
