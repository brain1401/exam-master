import { RootState } from "@/lib/store";
import { ExamProblem, ExamProblemSet } from "@/types/problems";
import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit";

type StateType = {
  examProblems: ExamProblemSet;
  currentExamProblemIndex: number;
};

const initialState: StateType = {
  examProblems: {
    uuid: undefined,
    name: "",
    problems: [],
  },
  currentExamProblemIndex: 0,
};

export const examProblemSlice = createSlice({
  name: "examProblems",
  initialState,
  reducers: {
    reset: () => initialState,
    setExamProblemsAction: (state, action: PayloadAction<ExamProblemSet>) => {
      state.examProblems = action.payload;
    },
    setCurrentExamProblemIndexAction: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.currentExamProblemIndex = action.payload;
    },
    setCurrentExamProblemAction: (
      state,
      action: PayloadAction<ExamProblem>,
    ) => {
      state.examProblems.problems[state.currentExamProblemIndex] =
        action.payload;
    },
    setExamProblemNameAction: (state, action: PayloadAction<string>) => {
      state.examProblems.name = action.payload;
    },
  },
});

export const {
  reset,
  setExamProblemsAction,
  setCurrentExamProblemIndexAction,
  setCurrentExamProblemAction,
  setExamProblemNameAction,
} = examProblemSlice.actions;

export const selectCurrentExamProblem = createSelector(
  (state: RootState) => state.examProblemReducer.examProblems,
  (state: RootState) => state.examProblemReducer.currentExamProblemIndex,
  (examProblems, currentExamProblemIndex) =>
    examProblems.problems?.[currentExamProblemIndex],
);

export const selectCurrentExamProblemIndex = (state: RootState) =>
  state.examProblemReducer.currentExamProblemIndex;

export const selectExamProblems = (state: RootState) =>
  state.examProblemReducer.examProblems;

export const selectExamProblemName = (state: RootState) =>
  state.examProblemReducer.examProblems.name;

export default examProblemSlice.reducer;
