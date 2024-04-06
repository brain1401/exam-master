import {
  timeLimitAtom,
  isExamStartedAtom,
  currentExamProblemIndexAtom,
  publicExamProblemsAtom,
  currentPublicExamProblemAtom,
  currentPublicExamProblemCandidatesAtom,
  publicExamProblemSetAtom,
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

  return {
    isExamStarted,
    timeLimit,
    currentExamProblemIndex,
    publicExamProblems,
    currentPublicExamProblem,
    currentPublicExamProblemCandidates,
    publicExamProblemSet,
    setPublicExamProblemSet,
    setCurrentPublicExamProblemCandidates,
    setCurrentPublicExamProblem,
    setCurrentExamProblemIndex,
    setPublicExamProblems,
    setIsExamStarted,
    setTimeLimit,
  };
}
