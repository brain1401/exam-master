import { RootState } from "@/lib/store";
import { ExamProblemResult } from "@/types/problems";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
  examProblemResults: ExamProblemResult[];
  examProblemResultsIndex: number;
};

const initialState: StateType = {
  examProblemResults: [],
  examProblemResultsIndex: 0,
};

const examProblemResultsSclice = createSlice({
  name: "examProblemResults",
  initialState,
  reducers: {
    reset: () => initialState,
    setExamProblemResultsAction: (
      state,
      action: PayloadAction<ExamProblemResult[]>,
    ) => {
      state.examProblemResults = action.payload;
    },
    setExamProblemResultsIndexAction: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.examProblemResultsIndex = action.payload;
    },
    setCurrentProblemResultAction: (
      state,
      action: PayloadAction<ExamProblemResult>,
    ) => {
      state.examProblemResults[state.examProblemResultsIndex] = action.payload;
    },
  },
});

export const {
  reset,
  setExamProblemResultsAction,
  setExamProblemResultsIndexAction,
  setCurrentProblemResultAction,
} = examProblemResultsSclice.actions;

export const selectExamProblemResults = (state: RootState) =>
  state.examProblemResultsReducer.examProblemResults;

export const selectExamProblemResultsIndex = (state: RootState) =>
  state.examProblemResultsReducer.examProblemResultsIndex;

export const selectCurrentExamProblemResult = createSelector(
  selectExamProblemResults,
  selectExamProblemResultsIndex,
  (examProblemResults, examProblemResultsIndex) =>
    examProblemResults[examProblemResultsIndex],
);

export default examProblemResultsSclice.reducer;
