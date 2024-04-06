import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { useEffect, useState } from "react";
import ExamHeader from "../exam/ExamHeader";
import ExamProgressBar from "../exam/ExamProgressBar";
import ExamFooter from "../exam/ExamFooter";
import ExamProblem from "../exam/ExamProblem";

type Props = {
  problemSetTimeLimit: number;
  publicSetUUID: string;
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userUUID: string | null | undefined;
};

export default function PublicProblemExamPage({ problemSetTimeLimit }: Props) {
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

  useEffect(() => {
    return () => {
      setIsExamStarted(false);
    };
  }, [setIsExamStarted]);

  useEffect(() => {
    return () => {
      setTimeLimit(problemSetTimeLimit.toString());
    };
  }, [setTimeLimit, problemSetTimeLimit]);

  useEffect(() => {
    return () => {
      setCurrentExamProblemIndex(0);
    };
  }, [setCurrentExamProblemIndex]);

  return (
    <section className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8">
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
          problem={currentPublicExamProblem}
          candidates={currentPublicExamProblemCandidates}
          setCurrentPublicExamProblemCandidates={
            setCurrentPublicExamProblemCandidates
          }
        />
        <ExamFooter
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
