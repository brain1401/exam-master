import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

type StateType = {
  resultPage: number;
  resultMaxPage: number;
  managePage: number;
  manageMaxPage: number;
  examPage: number;
  examMaxPage: number;
};

const initialState: StateType = {
  resultPage: 1,
  resultMaxPage: 1,
  managePage: 1,
  manageMaxPage: 1,
  examPage: 1,
  examMaxPage: 1,
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
    setManagePageAction: (state, action) => {
      state.managePage = action.payload;
    },
    setManageMaxPageAction: (state, action) => {
      state.manageMaxPage = action.payload;
    },
    setExamPageAction: (state, action) => {
      state.examPage = action.payload;
    },
    setExamMaxPageAction: (state, action) => {
      state.examMaxPage = action.payload;
    },
  },
});

export const {
  setExamMaxPageAction,
  setExamPageAction,
  setManageMaxPageAction,
  setManagePageAction,
  setResultMaxPageAction,
  setResultPageAction,
  resetAction,
} = pagenationSlice.actions;

export const selectResultPage = (state: RootState) =>
  state.pagenationReducer.resultPage;
export const selectResultMaxPage = (state: RootState) =>
  state.pagenationReducer.resultMaxPage;
export const selectManagePage = (state: RootState) =>
  state.pagenationReducer.managePage;
export const selectManageMaxPage = (state: RootState) =>
  state.pagenationReducer.manageMaxPage;
export const selectExamPage = (state: RootState) =>
  state.pagenationReducer.examPage;
export const selectExamMaxPage = (state: RootState) =>
  state.pagenationReducer.examMaxPage;

export default pagenationSlice.reducer;
