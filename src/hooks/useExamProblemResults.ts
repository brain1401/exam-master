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
