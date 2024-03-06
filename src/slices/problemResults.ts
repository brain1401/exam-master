import { RootState } from "@/lib/store";
import { ProblemResult } from "@/types/problems";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
  problemResults: ProblemResult[];
  problemResultsIndex: number;
};

const initialState: StateType = {
  problemResults: [],
  problemResultsIndex: 0,
};

const problemResultsSclice = createSlice({
  name: "problemResults",
  initialState,
  reducers: {
    reset: () => initialState,
    setProblemResultsAction: (
      state,
      action: PayloadAction<ProblemResult[]>,
    ) => {
      state.problemResults = action.payload;
    },
    setProblemResultsIndexAction: (state, action: PayloadAction<number>) => {
      state.problemResultsIndex = action.payload;
    },
    setCurrentProblemResultAction: (
      state,
      action: PayloadAction<ProblemResult>,
    ) => {
      state.problemResults[state.problemResultsIndex] = action.payload;
    },
  },
});

export const {
  reset,
  setProblemResultsAction,
  setProblemResultsIndexAction,
  setCurrentProblemResultAction,
} = problemResultsSclice.actions;

export const selectProblemResults = (state: RootState) =>
  state.problemResultsReducer.problemResults;

export const selectProblemResultsIndex = (state: RootState) =>
  state.problemResultsReducer.problemResultsIndex;

export const selectCurrentProblemResult = createSelector(
  selectProblemResults,
  selectProblemResultsIndex,
  (problemResults, problemResultsIndex) => problemResults[problemResultsIndex],
);

export default problemResultsSclice.reducer;
