import { useAtom, useSetAtom } from "jotai";
import {
  problemsAtom,
  candidatesCountAtom,
  currentProblemAtom,
  currentProblemCandidatesAtom,
  currentProblemIndexAtom,
  currentTabAtom,
  initCurrentProblemAtom,
  localProblemSetsNameAtom,
  problemLengthAtom,
  problemSetsNameAtom,
  resetProblemsAtom,
} from "@/jotai/problems";

export default function useProblems() {
  const [problems, setProblems] = useAtom(problemsAtom);
  const [candidatesCount, setCandidatesCount] = useAtom(candidatesCountAtom);
  const [currentProblem, setCurrentProblem] = useAtom(currentProblemAtom);
  const [currentProblemCandidates, setCurrentProblemCandidates] = useAtom(
    currentProblemCandidatesAtom,
  );
  const [currentProblemIndex, setCurrentProblemIndex] = useAtom(
    currentProblemIndexAtom,
  );
  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);
  const initCurrentProblem = useSetAtom(initCurrentProblemAtom);

  const [localProblemSetsName, setLocalProblemSetsName] = useAtom(
    localProblemSetsNameAtom,
  );

  const [problemLength, setProblemLength] = useAtom(problemLengthAtom);
  const [problemSetsName, setProblemSetsName] = useAtom(problemSetsNameAtom);
  const resetProblems = useSetAtom(resetProblemsAtom);

  return {
    problems,
    setProblems,
    candidatesCount,
    setCandidatesCount,
    currentProblem,
    setCurrentProblem,
    currentProblemCandidates,
    setCurrentProblemCandidates,
    currentProblemIndex,
    setCurrentProblemIndex,
    currentTab,
    setCurrentTab,
    initCurrentProblem,
    localProblemSetsName,
    setLocalProblemSetsName,
    problemLength,
    setProblemLength,
    problemSetsName,
    setProblemSetsName,
    resetProblems,
  };
}
