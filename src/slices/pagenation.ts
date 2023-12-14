import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

type StateType = {
  resultPage: number;
  resultMaxPage: number;
  problemSetsPage: number;
  problemSetsMaxPage: number;
  pageSize: number;
};

const initialState: StateType = {
  resultPage: 1,
  resultMaxPage: 1,
  problemSetsPage: 1,
  problemSetsMaxPage: 1,
  pageSize: 0,
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
export const selectPageSize = (state: RootState) =>
  state.pagenationReducer.pageSize;


export default pagenationSlice.reducer;
