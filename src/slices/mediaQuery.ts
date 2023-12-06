import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

type StateType = {
  isXxs: boolean;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
};

const initialState: StateType = {
  isXxs: false,
  isXs: false,
  isSm: false,
  isMd: false,
  isLg: false,
  isXl: false,
};

export const mediaQuerySlice = createSlice({
  name: "mediaQuery",
  initialState,
  reducers: {
    setMediaQueryAction: (state, action: PayloadAction<Partial<StateType>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const mediaQuerySelector = (state: RootState) => state.mediaQueryReducer;

export const { setMediaQueryAction } = mediaQuerySlice.actions;

export default mediaQuerySlice.reducer;
