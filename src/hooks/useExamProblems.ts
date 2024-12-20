import {
  examProblemSetAtom,
  currentExamProblemAtom,
  currentExamProblemIndexAtom,
  examProblemSetNameAtom,
  examProblemsAtom,
  resetExamProblemAnswersAtom,
  currentExamProblemCandidatesAtom,
  currentExamProblemSubAnswerAtom,
  setExamProblemsOriginalAtom,
  setExamProblemsRandomAtom,
  isExamStartedAtom,
  isTimeOverAtom,
} from "@/jotai/examProblems";
import { useAtom, useSetAtom } from "jotai";

export default function useExamProblems() {
  const [examProblemSet, setExamProblemSet] = useAtom(examProblemSetAtom);
  const [currentExamProblem, setCurrentExamProblem] = useAtom(
    currentExamProblemAtom,
  );
  const [currentExamProblemIndex, setCurrentExamProblemIndex] = useAtom(
    currentExamProblemIndexAtom,
  );
  const [examProblemSetName, setExamProblemSetName] = useAtom(
    examProblemSetNameAtom,
  );
  const [examProblems, setExamProblems] = useAtom(examProblemsAtom);

  const [isExamStarted, setIsExamStarted] = useAtom(isExamStartedAtom);

  const [isTimeOver, setIsTimeOver] = useAtom(isTimeOverAtom);


  const [currentExamProblemCandidates, setCurrentExamProblemCandidates] =
    useAtom(currentExamProblemCandidatesAtom);

  const [currentExamProblemSubAnswer, setCurrentExamProblemSubAnswer] = useAtom(
    currentExamProblemSubAnswerAtom,
  );

  const setExamProblemsOriginal = useSetAtom(setExamProblemsOriginalAtom);
  const setExamProblemsRandom = useSetAtom(setExamProblemsRandomAtom);

  const resetExamProblems = useSetAtom(resetExamProblemAnswersAtom);

  return {
    examProblemSet,
    setExamProblemSet,
    examProblems,
    setExamProblems,
    currentExamProblem,
    setCurrentExamProblem,
    currentExamProblemIndex,
    setCurrentExamProblemIndex,
    examProblemSetName,
    setExamProblemSetName,
    currentExamProblemCandidates,
    setCurrentExamProblemCandidates,
    currentExamProblemSubAnswer,
    setCurrentExamProblemSubAnswer,
    setExamProblemsOriginal,
    setExamProblemsRandom,
    isExamStarted,
    setIsExamStarted,
    isTimeOver,
    setIsTimeOver,
    resetExamProblems,
  };
}
