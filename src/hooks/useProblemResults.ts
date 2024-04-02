import {
  currentExamResultIndexAtom,
  examResultsSetAtom,
  currentExamResultAtom,
  examResultsAtom,
  resetExamProblemResultsAtom,
} from "@/jotai/examResult";
import { useAtom, useSetAtom } from "jotai";

export default function useProblemResults() {
  const [examResultsSet, setExamResultsSet] = useAtom(examResultsSetAtom);
  const [currentExamResultIndex, setCurrentExamResultIndex] = useAtom(
    currentExamResultIndexAtom,
  );
  const [currentExamResult, setCurrentExamResult] = useAtom(
    currentExamResultAtom,
  );

  const [examResults, setExamResults] = useAtom(examResultsAtom);

  const resetExamProblemResults = useSetAtom(resetExamProblemResultsAtom);

  return {
    examResultsSet,
    setExamResultsSet,
    currentExamResultIndex,
    setCurrentExamResultIndex,
    examResults,
    setExamResults,
    currentExamResult,
    setCurrentExamResult,
    resetExamProblemResults,
  };
}
