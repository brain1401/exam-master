import {
  problemsAtom,
  candidatesCountAtom,
  currentProblemIndexAtom,
  currentTabAtom,
  descriptionAtom,
  initCurrentProblemAtom,
  isPublicAtom,
  localProblemSetsNameAtom,
  problemLengthAtom,
  problemSetsNameAtom,
  timeLimitAtom,
  resetProblemsAtom,
  currentProblemAtom,
  currentProblemCandidatesAtom,
} from "@/jotai/problems";
import { useAtom, useSetAtom } from "jotai";

export default function useProblems() {
  const [problems, setProblems] = useAtom(problemsAtom);
  const [candidatesCount, setCandidatesCount] = useAtom(candidatesCountAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
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
  const [problemSetIsPublic, setProblemSetIsPublic] = useAtom(isPublicAtom);
  const [timeLimit, setTimeLimit] = useAtom(timeLimitAtom);
  const resetProblems = useSetAtom(resetProblemsAtom);

  return {
    problems,
    setProblems,
    candidatesCount,
    setCandidatesCount,
    description,
    setDescription,
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
    problemSetIsPublic,
    setProblemSetIsPublic,
    timeLimit,
    setTimeLimit,
    resetProblems,
  };
}
