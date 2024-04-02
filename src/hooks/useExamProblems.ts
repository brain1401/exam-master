import {
  examProblemSetAtom,
  currentExamProblemAtom,
  currentExamProblemIndexAtom,
  examProblemSetNameAtom,
  examProblemsAtom,
  resetExamProblemAnswersAtom,
} from "@/jotai/examProblems";
import { useAtom, useSetAtom } from "jotai";

export default function useExamProblems() {
  const [examProblemSets, setExamProblemSets] = useAtom(examProblemSetAtom);
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
  
  const resetExamProblems = useSetAtom(resetExamProblemAnswersAtom);

  return {
    examProblemSets,
    setExamProblemSets,
    examProblems,
    setExamProblems,
    currentExamProblem,
    setCurrentExamProblem,
    currentExamProblemIndex,
    setCurrentExamProblemIndex,
    examProblemSetName,
    setExamProblemSetName,
    resetExamProblems,
  };
}
