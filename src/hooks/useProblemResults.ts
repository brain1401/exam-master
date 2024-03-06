import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  reset,
  selectCurrentProblemResult,
  selectProblemResults,
  selectProblemResultsIndex,
  setCurrentProblemResultAction,
  setProblemResultsAction,
  setProblemResultsIndexAction,
} from "@/slices/problemResults";
import { ProblemResult } from "@/types/problems";
import { useCallback } from "react";

export default function useProblemResults() {
  const dispatch = useAppDispatch();
  const examProblemResults = useAppSelector(selectProblemResults);
  const examProblemResultsIndex = useAppSelector(selectProblemResultsIndex);
  const currentExamProblemResult = useAppSelector(
    selectCurrentProblemResult,
  );

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.
  const setExamProblemResults = useCallback(
    (examProblemResults: ProblemResult[]) => {
      dispatch(setProblemResultsAction(examProblemResults));
    },
    [dispatch],
  );

  const setExamProblemResultsIndex = useCallback(
    (examProblemResultsIndex: number) => {
      dispatch(setProblemResultsIndexAction(examProblemResultsIndex));
    },
    [dispatch],
  );

  const setCurrentExamProblemResult = useCallback(
    (examProblemResult: ProblemResult) => {
      dispatch(setCurrentProblemResultAction(examProblemResult));
    },
    [dispatch],
  );

  const resetExamProblemResults = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  return {
    examProblemResults,
    setExamProblemResults,
    examProblemResultsIndex,
    setExamProblemResultsIndex,
    currentExamProblemResult,
    setCurrentExamProblemResult,
    resetExamProblemResults,
  };
}
