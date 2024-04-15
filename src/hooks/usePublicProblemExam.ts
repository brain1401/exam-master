import {
  timeLimitAtom,
  currentExamProblemIndexAtom,
  publicExamProblemsAtom,
  currentPublicExamProblemAtom,
  currentPublicExamProblemCandidatesAtom,
  publicExamProblemSetAtom,
  originalProblemsAtom,
  isRandomSelectedAtom,
  setPublicExamProblemsOriginalAtom,
  setPublicExamProblemsRandomAtom,
  currentPublicExamProblemSubAnswerAtom,
  isTimeOverAtom,
  resetPublicProblemExamAtom,
} from "@/jotai/publicProblemExam";
import { useAtom, useSetAtom } from "jotai";

export function usePublicProblemExam() {
  const [timeLimit, setTimeLimit] = useAtom(timeLimitAtom);
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

  const [originalProblems, setOriginalProblems] = useAtom(originalProblemsAtom);

  const [
    currentPublicExamProblemCandidates,
    setCurrentPublicExamProblemCandidates,
  ] = useAtom(currentPublicExamProblemCandidatesAtom);

  const [
    currentPublicExamProblemSubAnswer,
    setCurrentPublicExamProblemSubAnswer,
  ] = useAtom(currentPublicExamProblemSubAnswerAtom);

  const [isRandomSelected, setIsRandomSelected] = useAtom(isRandomSelectedAtom);

  const [isTimeOver, setIsTimeOver] = useAtom(isTimeOverAtom);

  const setPublicExamProblemsOriginal = useSetAtom(
    setPublicExamProblemsOriginalAtom,
  );

  const setPublicExamProblemsRandom = useSetAtom(
    setPublicExamProblemsRandomAtom,
  );

  const resetPublicProblemExam = useSetAtom(resetPublicProblemExamAtom);

  return {
    timeLimit,
    currentExamProblemIndex,
    publicExamProblems,
    currentPublicExamProblem,
    currentPublicExamProblemCandidates,
    publicExamProblemSet,
    currentPublicExamProblemSubAnswer,
    isRandomSelected,
    isTimeOver,
    originalProblems,
    setOriginalProblems,
    setIsTimeOver,
    setPublicExamProblemsOriginal,
    setPublicExamProblemsRandom,
    setIsRandomSelected,
    setCurrentPublicExamProblemSubAnswer,
    setPublicExamProblemSet,
    setCurrentPublicExamProblemCandidates,
    setCurrentPublicExamProblem,
    setCurrentExamProblemIndex,
    setPublicExamProblems,
    setTimeLimit,
    resetPublicProblemExam,
  };
}
