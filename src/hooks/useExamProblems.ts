import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCurrentExamProblem,
  selectCurrentExamProblemIndex,
  selectExamProblemName,
  selectExamProblems,
  setExamProblemsAction,
  setCurrentExamProblemAction,
  setCurrentExamProblemIndexAction,
  setExamProblemNameAction,
  reset,
} from "@/slices/examProblems";
import { ExamProblem, ExamProblemSet } from "@/types/problems";
import { useCallback } from "react";

export default function useExamProblems() {
  const dispatch = useAppDispatch();
  const examProblems = useAppSelector(selectExamProblems);
  const currentExamProblemIndex = useAppSelector(selectCurrentExamProblemIndex);
  const currentExamProblem = useAppSelector(selectCurrentExamProblem);
  const examProblemName = useAppSelector(selectExamProblemName);

  const setExamProblems = useCallback(
    (examProblems: ExamProblemSet) => {
      dispatch(setExamProblemsAction(examProblems));
    },
    [dispatch],
  );

  const setCurrentExamProblem = useCallback(
    (currentExamProblem: ExamProblem) => {
      dispatch(setCurrentExamProblemAction(currentExamProblem));
    },
    [dispatch],
  );

  const setCurrentExamProblemIndex = useCallback(
    (currentExamProblemIndex: number) => {
      dispatch(setCurrentExamProblemIndexAction(currentExamProblemIndex));
    },
    [dispatch],
  );

  const setExamProblemName = useCallback(
    (examProblemName: string) => {
      dispatch(setExamProblemNameAction(examProblemName));
    },
    [dispatch],
  );

  const resetExamProblems = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  return {
    examProblems,
    setExamProblems,
    currentExamProblem,
    setCurrentExamProblem,
    currentExamProblemIndex,
    setCurrentExamProblemIndex,
    examProblemName,
    setExamProblemName,
    resetExamProblems,
  };
}
