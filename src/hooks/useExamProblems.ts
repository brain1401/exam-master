import { useAtom, useSetAtom } from "jotai";
import {
  currentExamProblemAtom,
  currentExamProblemIndexAtom,
  examProblemNameAtom,
  examProblemsAtom,
  resetExamProblemsAtom,
} from "@/jotai/examProblems";

export default function useExamProblems() {
  const [examProblems, setExamProblems] = useAtom(examProblemsAtom);
  const [currentExamProblem, setCurrentExamProblem] = useAtom(
    currentExamProblemAtom
  );
  const [currentExamProblemIndex, setCurrentExamProblemIndex] = useAtom(
    currentExamProblemIndexAtom
  );
  const [examProblemName, setExamProblemName] = useAtom(examProblemNameAtom);
  const resetExamProblems = useSetAtom(resetExamProblemsAtom);

  return {
    examProblems,
    setExamProblems,
    currentExamProblem,
    setCurrentExamProblem,
    currentExamProblemIndex,
    setCurrentExamProblemIndex,
    examProblemName,
    setExamProblemName,
    resetExamProblems,
  }
}
