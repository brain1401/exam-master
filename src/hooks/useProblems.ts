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
  resetProblemsAtom,
  currentProblemAtom,
  currentProblemCandidatesAtom,
} from "@/app/jotai/problems";
import { useAtom, useSetAtom, useAtomValue } from "jotai";

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
    resetProblems,
  };
}
