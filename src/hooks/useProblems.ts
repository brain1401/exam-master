import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectProblems,
  setProblemsAction,
  initCurrentProblemAction,
  resetProblemsAction,
  selectCurrentProblem,
  selectCurrentProblemCandidates,
  setCandidateCountAction,
  setCurrentProblemAction,
  setCurrentProblemCandidatesAction,
  setCurrentProblemIndexAction,
  setCurrentTabAction,
  setProblemLengthAction,
  setProblemSetsNameAction,
  setLocalProblemSetsNameAction,
} from "@/slices/problems";
import { Problem, candidate } from "@/types/problems";
import { useCallback } from "react";

export default function useProblems() {
  const dispatch = useAppDispatch();

  const problems = useAppSelector(selectProblems);
  const currentProblem = useAppSelector(selectCurrentProblem);
  const currentProblemCandidates = useAppSelector(
    selectCurrentProblemCandidates,
  );
  const candidatesCount = currentProblemCandidates?.length.toString() ?? "4";

  const currentProblemIndex = useAppSelector(
    (state) => state.problemsReducer.currentProblemIndex,
  );
  const currentTab = useAppSelector(
    (state) => state.problemsReducer.currentTab,
  );
  const problemLength = useAppSelector(
    (state) => state.problemsReducer.problemLength,
  );
  const problemSetsName = useAppSelector(
    (state) => state.problemsReducer.problemSetsName,
  );
  const localProblemSetsName = useAppSelector(
    (state) => state.problemsReducer.localProblemSetsName,
  );

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.
  const setLocalProblemSetsName = useCallback(
    (name: string) => {
      dispatch(setLocalProblemSetsNameAction(name));
    },
    [dispatch],
  );

  const setProblems = useCallback(
    (problems: Problem[]) => {
      dispatch(setProblemsAction(problems));
    },
    [dispatch],
  );

  const initCurrentProblem = useCallback(() => {
    dispatch(initCurrentProblemAction());
  }, [dispatch]);

  const resetProblems = useCallback(() => {
    dispatch(resetProblemsAction());
  }, [dispatch]);

  const setCandidatesCount = useCallback(
    (count: string) => {
      dispatch(setCandidateCountAction(count));
    },
    [dispatch],
  );

  const setProblemLength = useCallback(
    (length: string) => {
      dispatch(setProblemLengthAction(length));
    },
    [dispatch],
  );

  const setCurrentProblem = useCallback(
    (problem: Partial<Problem>) => {
      dispatch(setCurrentProblemAction(problem));
    },
    [dispatch],
  );

  const setCurrentProblemCandidates = useCallback(
    (candidates: candidate[]) => {
      dispatch(setCurrentProblemCandidatesAction(candidates));
    },
    [dispatch],
  );

  const setCurrentProblemIndex = useCallback(
    (index: number) => {
      dispatch(setCurrentProblemIndexAction(index));
    },
    [dispatch],
  );

  const setCurrentTab = useCallback(
    (tab: "obj" | "sub") => {
      dispatch(setCurrentTabAction(tab));
    },
    [dispatch],
  );

  const setProblemSetsName = useCallback(
    (name: string) => {
      dispatch(setProblemSetsNameAction(name));
    },
    [dispatch],
  );

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
