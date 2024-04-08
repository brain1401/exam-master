import { timeLimitAtom } from "@/jotai/timeLimit";
import { useAtom } from "jotai";

export function useTimeLimit() {
  const [timeLimit, setTimeLimit] = useAtom(timeLimitAtom);

  return {
    timeLimit,
    setTimeLimit,
  };
}
