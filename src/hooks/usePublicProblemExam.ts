import {
  timeLimitAtom,
  isExamStartedAtom,
  currentExamProblemIndexAtom,
  publicExamProblemsAtom,
  currentPublicExamProblemAtom,
  currentPublicExamProblemCandidatesAtom,
  publicExamProblemSetAtom,
  isRandomSelectedAtom,
  setPublicExamProblemsOriginalAtom,
  setPublicExamProblemsRandomAtom,
  currentPublicExamProblemSubAnswerAtom,
} from "@/jotai/publicProblemExam";
import { useAtom, useSetAtom } from "jotai";

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

  const [isRandomSelected, setIsRandomSelected] = useAtom(isRandomSelectedAtom);

  const setPublicExamProblemsOriginal = useSetAtom(
    setPublicExamProblemsOriginalAtom,
  );

  const setPublicExamProblemsRandom = useSetAtom(
    setPublicExamProblemsRandomAtom,
  );

  return {
    isExamStarted,
    timeLimit,
    currentExamProblemIndex,
    publicExamProblems,
    currentPublicExamProblem,
    currentPublicExamProblemCandidates,
    publicExamProblemSet,
    currentPublicExamProblemSubAnswer,
    isRandomSelected,
    setPublicExamProblemsOriginal,
    setPublicExamProblemsRandom,
    setIsRandomSelected,
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
