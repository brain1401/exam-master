import { RootState } from "@/lib/store";
import {
  ExamProblem,
  ExamProblemAnswer,
  ExamProblemSet,
} from "@/types/problems";
import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit";

type StateType = {
  examProblemAnswers: ExamProblemAnswer[];
  currentExamProblemIndex: number;
};

const initialState: StateType = {
  examProblemAnswers: [],
  currentExamProblemIndex: 0,
};

export const examProblemSlice = createSlice({
  name: "examProblems",
  initialState,
  reducers: {
    reset: () => initialState,
    setExamProblemAnswersAction: (
      state,
      action: PayloadAction<ExamProblemAnswer[]>,
    ) => {
      state.examProblemAnswers = action.payload;
    },
    setExamProblemAnswerAction: (
      state,
      action: PayloadAction<ExamProblemAnswer>,
    ) => {
      state.examProblemAnswers[state.currentExamProblemIndex] = action.payload;
    },
    setCurrentExamProblemIndexAction: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.currentExamProblemIndex = action.payload;
    },
  },
});

export const {
  reset,
  setExamProblemAnswersAction,
  setCurrentExamProblemIndexAction,
  setExamProblemAnswerAction,
} = examProblemSlice.actions;

export const selectExamProblemAnswers = (state: RootState) =>
  state.examProblemReducer.examProblemAnswers;

export const selectCurrentExamProblemIndex = (state: RootState) =>
  state.examProblemReducer.currentExamProblemIndex;

export const selectCurrentExamProblemAnswer = createSelector(
  (state: RootState) => state.examProblemReducer.examProblemAnswers,
  (state: RootState) => state.examProblemReducer.currentExamProblemIndex,
  (examProblemAnswers, currentExamProblemIndex) =>
    examProblemAnswers[currentExamProblemIndex],
);

export default examProblemSlice.reducer;
