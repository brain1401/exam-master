import { currentExamProblemAtom, currentExamProblemIndexAtom } from "@/jotai/examProblems"; 
import { useAtomValue } from "jotai";

export default function CurrentQuestion() {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);
  const currentExamProblemIndex = useAtomValue(currentExamProblemIndexAtom);


  return (
    <div className="mb-5 text-2xl">
      <span>Q{currentExamProblemIndex + 1}. </span>
      {currentExamProblem?.question ?? "문제가 없습니다." }
    </div>
  );
}