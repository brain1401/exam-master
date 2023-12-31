import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

type UIState = {
  isDeleteButtonClicked: boolean;
  toDeletedUuid: string[];
};

const initialState: UIState = {
  isDeleteButtonClicked: false,
  toDeletedUuid: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsDeleteButtonClickedAction(state, action) {
      state.isDeleteButtonClicked = action.payload;
    },
    addToDeletedUuidAction(state, action) {
      state.toDeletedUuid.push(action.payload);
    },
    removeToDeletedUuidAction(state, action) {
      state.toDeletedUuid = state.toDeletedUuid.filter(
        (uuid) => uuid !== action.payload,
      );
    },
    resetToDeletedUuidAction(state) {
      state.toDeletedUuid = [];
    },
  },
});

export const {
  setIsDeleteButtonClickedAction,
  addToDeletedUuidAction,
  removeToDeletedUuidAction,
  resetToDeletedUuidAction,
} = uiSlice.actions;

export const selectIsDeleteButtonClicked = (state: RootState) =>
  state.uiReducer.isDeleteButtonClicked;
export const selectToDeletedUuid = (state: RootState) =>
  state.uiReducer.toDeletedUuid;

export default uiSlice.reducer;
