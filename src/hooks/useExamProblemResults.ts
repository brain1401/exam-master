import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  reset,
  selectCurrentExamProblemResult,
  selectExamProblemResults,
  selectExamProblemResultsIndex,
  setCurrentProblemResultAction,
  setExamProblemResultsAction,
  setExamProblemResultsIndexAction,
} from "@/slices/examProblemResults";
import { ExamProblemResult } from "@/types/problems";
import { useCallback } from "react";

export default function useExamProblemResults() {
  const dispatch = useAppDispatch();
  const examProblemResults = useAppSelector(selectExamProblemResults);
  const examProblemResultsIndex = useAppSelector(selectExamProblemResultsIndex);
  const currentExamProblemResult = useAppSelector(
    selectCurrentExamProblemResult,
  );

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.
  const setExamProblemResults = useCallback(
    (examProblemResults: ExamProblemResult[]) => {
      dispatch(setExamProblemResultsAction(examProblemResults));
    },
    [dispatch],
  );

  const setExamProblemResultsIndex = useCallback(
    (examProblemResultsIndex: number) => {
      dispatch(setExamProblemResultsIndexAction(examProblemResultsIndex));
    },
    [dispatch],
  );

  const setCurrentExamProblemResult = useCallback(
    (examProblemResult: ExamProblemResult) => {
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
