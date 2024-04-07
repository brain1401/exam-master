import {
  timeLimitAtom,
  isExamStartedAtom,
  currentExamProblemIndexAtom,
  publicExamProblemsAtom,
  currentPublicExamProblemAtom,
  currentPublicExamProblemCandidatesAtom,
  publicExamProblemSetAtom,
  currentPublicExamProblemSubAnswerAtom,
} from "@/jotai/publicProblemExam";
import { useAtom } from "jotai";

export function usePublicProblemExam() {
  const [timeLimit, setTimeLimit] = useAtom(timeLimitAtom);
  const [isExamStarted, setIsExamStarted] = useAtom(isExamStartedAtom);
  const [currentExamProblemIndex, setCurrentExamProblemIndex] = useAtom(
    currentExamProblemIndexAtom,
  );
  const [publicExamProblems, setPublicExamProblems] = useAtom(
    publicExamProblemsAtom,
  );

  const [publicExamProblemSet, setPublicExamProblemSet] = useAtom(
    publicExamProblemSetAtom,
  );

  const [currentPublicExamProblem, setCurrentPublicExamProblem] = useAtom(
    currentPublicExamProblemAtom,
  );

  const [
    currentPublicExamProblemCandidates,
    setCurrentPublicExamProblemCandidates,
  ] = useAtom(currentPublicExamProblemCandidatesAtom);

  const [
    currentPublicExamProblemSubAnswer,
    setCurrentPublicExamProblemSubAnswer,
  ] = useAtom(currentPublicExamProblemSubAnswerAtom);

  return {
    isExamStarted,
    timeLimit,
    currentExamProblemIndex,
    publicExamProblems,
    currentPublicExamProblem,
    currentPublicExamProblemCandidates,
    publicExamProblemSet,
    currentPublicExamProblemSubAnswer,
    setCurrentPublicExamProblemSubAnswer,
    setPublicExamProblemSet,
    setCurrentPublicExamProblemCandidates,
    setCurrentPublicExamProblem,
    setCurrentExamProblemIndex,
    setPublicExamProblems,
    setIsExamStarted,
    setTimeLimit,
  };
}
