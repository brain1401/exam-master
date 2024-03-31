import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

type StateType = {
  resultPage: number;
  resultMaxPage: number | null;
  problemSetsPage: number;
  problemSetsMaxPage: number | null;
  publicProblemSetsPage: number;
  publicProblemSetsMaxPage: number | null;
  pageSize: number;
};

const initialState: StateType = {
  resultPage: 1,
  resultMaxPage: null,
  problemSetsPage: 1,
  problemSetsMaxPage: null,
  publicProblemSetsPage: 1,
  publicProblemSetsMaxPage: null,
  pageSize: 8,
};

const pagenationSlice = createSlice({
  name: "pagenation",
  initialState,
  reducers: {
    resetAction: () => initialState,
    setResultPageAction: (state, action) => {
      state.resultPage = action.payload;
    },
    setResultMaxPageAction: (state, action) => {
      state.resultMaxPage = action.payload;
    },
    setProblemSetsPageAction: (state, action) => {
      state.problemSetsPage = action.payload;
    },
    setProblemSetsMaxPageAction: (state, action) => {
      state.problemSetsMaxPage = action.payload;
    },
    setPublicProblemSetsPageAction: (state, action) => {
      state.publicProblemSetsPage = action.payload;
    },
    setPublicProblemSetsMaxPageAction: (state, action) => {
      state.publicProblemSetsMaxPage = action.payload;
    },
    setPageSizeAction: (state, action) => {
      state.pageSize = action.payload;
    },
  },
});

export const {
  setProblemSetsPageAction,
  setProblemSetsMaxPageAction,
  setResultMaxPageAction,
  setResultPageAction,
  setPageSizeAction,
  setPublicProblemSetsPageAction,
  setPublicProblemSetsMaxPageAction,
  resetAction,
} = pagenationSlice.actions;

export const selectResultPage = (state: RootState) =>
  state.pagenationReducer.resultPage;
export const selectResultMaxPage = (state: RootState) =>
  state.pagenationReducer.resultMaxPage;
export const selectProblemSetsPage = (state: RootState) =>
  state.pagenationReducer.problemSetsPage;
export const selectProblemSetsMaxPage = (state: RootState) =>
  state.pagenationReducer.problemSetsMaxPage;
export const selectPublicProblemSetsPage = (state: RootState) =>
  state.pagenationReducer.publicProblemSetsPage;
export const selectPublicProblemSetsMaxPage = (state: RootState) =>
  state.pagenationReducer.publicProblemSetsMaxPage;
export const selectPageSize = (state: RootState) =>
  state.pagenationReducer.pageSize;

export default pagenationSlice.reducer;
