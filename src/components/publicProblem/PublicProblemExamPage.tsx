import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { useEffect, useState } from "react";
import ExamHeader from "../exam/ExamHeader";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamFooter from "../exam/ExamFooter";
import ExamProblem from "../exam/ExamProblem";
import ExamSubmitButton from "../exam/ExamSubmitButton";
import { PublicExamProblemSet } from "@/types/problems";

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
    publicExamProblems,
    currentPublicExamProblemCandidates,
    setCurrentPublicExamProblem,
    setCurrentPublicExamProblemCandidates,
    setPublicExamProblems,
    setTimeLimit,
    setIsExamStarted,
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
    <section className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <ExamHeader
          totalProblems={publicExamProblems?.length ?? 0}
          currentExamProblemIndex={currentExamProblemIndex}
          setCurrentExamProblemIndex={setCurrentExamProblemIndex}
        />
        <ExamProgressBar
          timeLimit={problemSetTimeLimit}
          isTimeOver={isTimeOver}
          setIsTimeOver={setIsTimeOver}
        />
        <ExamProblem
          questionNumber={questionNumber}
          currentProblem={currentPublicExamProblem}
          candidates={currentPublicExamProblemCandidates}
          setCurrentPublicExamProblemCandidates={
            setCurrentPublicExamProblemCandidates
          }
        />
        <ExamFooter
          problemSet={publicProblemSet}
          publicExamProblems={publicExamProblems}
          setCurrentExamProblemIndex={setCurrentExamProblemIndex}
          setCurrentPublicExamProblemCandidates={
            setCurrentPublicExamProblemCandidates
          }
          currentExamProblemIndex={currentExamProblemIndex}
          setIsExamStarted={setIsExamStarted}
        />
      </div>
    </section>
  );
}
