import { RootState } from "@/lib/store";
import { Problem, Candidate } from "@/types/problems";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

type StateType = {
  problems: Problem[];
  isPublic: boolean;
  currentProblemIndex: number;
  problemSetsName: string;
  description: string;
  localProblemSetsName: string;
  problemLength: string;
  candidatesCount: string;
  currentTab: "obj" | "sub";
};

const initialState: StateType = {
  problems: Array.from(Array<Problem>(10), (_, i) =>
    i === 0
      ? {
          id: undefined,
          type: "obj",
          isPublic: false,
          question: "",
          additionalView: "",
          isAdditiondalViewButtonClicked: false,
          isImageButtonClicked: false,
          image: null,
          isAnswerMultiple: false,
          candidates: Array.from(Array<Candidate>(4), (_, i) => ({
            id: i,
            text: "",
            isAnswer: false,
          })),

          subAnswer: null,
        }
      : null,
  ),
  isPublic: false,
  currentProblemIndex: 0,
  currentTab: "obj",
  problemSetsName: "",
  description: "",
  localProblemSetsName: "",
  problemLength: "10",
  candidatesCount: "4",
};
export const problemsSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    resetProblemsAction: () => initialState,
    setProblemsAction: (state, action: PayloadAction<Problem[]>) => {
      state.problems = action.payload;
    },
    setCurrentProblemIndexAction: (state, action: PayloadAction<number>) => {
      state.currentProblemIndex = action.payload;
    },
    setProblemSetsNameAction: (state, action: PayloadAction<string>) => {
      state.problemSetsName = action.payload;
    },
    setPublicAction: (state, action: PayloadAction<boolean>) => {
      state.isPublic = action.payload;
    },
    setCurrentTabAction: (state, action: PayloadAction<"obj" | "sub">) => {
      state.currentTab = action.payload;
    },
    setCandidateCountAction: (state, action: PayloadAction<string>) => {
      state.candidatesCount = action.payload;
    },
    setDescriptionAction: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setProblemLengthAction: (state, action: PayloadAction<string>) => {
      state.problemLength = action.payload;
    },
    initCurrentProblemAction: (state) => {
      const { currentTab, currentProblemIndex, problems } = state;
      if (problems[currentProblemIndex] === null) {
        problems[currentProblemIndex] = {
          uuid: undefined,
          type: currentTab === "obj" ? "obj" : "sub",
          question: "",
          additionalView: "",
          isAdditiondalViewButtonClicked: false,
          isImageButtonClicked: false,
          image: null,
          isAnswerMultiple: false,
          candidates:
            currentTab === "obj"
              ? Array.from(Array<Candidate>(4), (_, i) => ({
                  id: i,
                  text: "",
                  isAnswer: false,
                }))
              : null,
          subAnswer: currentTab === "obj" ? null : "",
        };
      }
    },
    setCurrentProblemAction: (
      state,
      action: PayloadAction<Partial<Problem>>,
    ) => {
      const { currentProblemIndex } = state;
      state.problems[currentProblemIndex] = {
        ...state.problems[currentProblemIndex],
        ...action.payload,
      } as Problem;
    },
    setCurrentProblemCandidatesAction: (
      state,
      action: PayloadAction<Candidate[]>,
    ) => {
      const { currentProblemIndex, problems } = state;
      const currentProblem = problems[currentProblemIndex];
      if (currentProblem) {
        currentProblem.candidates = action.payload;
      }
    },
    setLocalProblemSetsNameAction: (state, action: PayloadAction<string>) => {
      state.localProblemSetsName = action.payload;
    },
  },
});

export const {
  initCurrentProblemAction,
  resetProblemsAction,
  setCandidateCountAction,
  setProblemLengthAction,
  setCurrentProblemAction,
  setCurrentProblemCandidatesAction,
  setCurrentProblemIndexAction,
  setCurrentTabAction,
  setPublicAction,
  setProblemSetsNameAction,
  setDescriptionAction,
  setProblemsAction,
  setLocalProblemSetsNameAction,
} = problemsSlice.actions;

export const selectCurrentProblem = createSelector(
  (state: RootState) => state.problemsReducer.problems,
  (state: RootState) => state.problemsReducer.currentProblemIndex,
  (problems, currentProblemIndex) => problems[currentProblemIndex],
);

export const selectCurrentProblemCandidates = createSelector(
  selectCurrentProblem,
  (problem) => problem?.candidates,
);

export const selectProblems = (state: RootState) =>
  state.problemsReducer.problems;

export default problemsSlice.reducer;
