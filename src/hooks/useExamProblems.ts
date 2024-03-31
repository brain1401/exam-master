import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCurrentExamProblemAnswer,
  selectExamProblemAnswers,
  setExamProblemAnswersAction,
  setExamProblemAnswerAction,
  selectCurrentExamProblemIndex,
  setCurrentExamProblemIndexAction,
  reset,
} from "@/slices/examProblems";
import { ExamProblemAnswer } from "@/types/problems";
import { useCallback } from "react";

export default function useExamProblems() {
  const dispatch = useAppDispatch();
  const currentExamProblemIndex = useAppSelector(selectCurrentExamProblemIndex);
  const examProblemAnswers = useAppSelector(selectExamProblemAnswers);
  const currentExamProblemAnswer = useAppSelector(
    selectCurrentExamProblemAnswer,
  );

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.

  const setExamProblemAnswers = useCallback(
    (examProblemAnswers: ExamProblemAnswer[]) => {
      dispatch(setExamProblemAnswersAction(examProblemAnswers));
    },
    [dispatch],
  );

  const setCurrentExamProblemAnswer = useCallback(
    (examProblemAnswer: ExamProblemAnswer) => {
      dispatch(setExamProblemAnswerAction(examProblemAnswer));
    },
    [dispatch],
  );

  const setCurrentExamProblemIndex = useCallback(
    (currentExamProblemIndex: number) => {
      dispatch(setCurrentExamProblemIndexAction(currentExamProblemIndex));
    },
    [dispatch],
  );

  const resetExamProblemAnswers = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  return {
    currentExamProblemIndex,
    examProblemAnswers,
    currentExamProblemAnswer,
    setExamProblemAnswers,
    setCurrentExamProblemAnswer,
    setCurrentExamProblemIndex,
    resetExamProblemAnswers,
  };
}
