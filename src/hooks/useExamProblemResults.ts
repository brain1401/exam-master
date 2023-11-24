import { useAtom, useSetAtom} from "jotai"
import * as atoms from "@/jotai/examProblemResult"

export default function useExamProblemResults() {
  const [examProblemResults, setExamProblemResults] = useAtom(atoms.examProblemResultsAtom)
  const [examProblemResultsIndex, setExamProblemResultsIndex] = useAtom(atoms.examProblemResultsIndexAtom)
  const [currentExamProblemResult, setCurrentExamProblemResult] = useAtom(atoms.currentExamProblemResultAtom)
  const resetExamProblemResults = useSetAtom(atoms.resetExamProblemResultsAtom)


  return {
    examProblemResults,
    setExamProblemResults,
    examProblemResultsIndex,
    setExamProblemResultsIndex,
    currentExamProblemResult,
    setCurrentExamProblemResult,
    resetExamProblemResults
  };

  
}