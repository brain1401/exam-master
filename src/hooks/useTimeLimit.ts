import { timeLimitAtom, isRandomExamAtom } from "@/jotai/examExternelState";
import { useAtom } from "jotai";

export function useExamExternelState() {
  const [timeLimit, setTimeLimit] = useAtom(timeLimitAtom);
  const [isRandomExam, setIsRandomExam] = useAtom(isRandomExamAtom);

  return {
    timeLimit,
    isRandomExam,
    setIsRandomExam,
    setTimeLimit,
  };
}
