import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavbarOpen: false,
};

export const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleNavbar: (state) => {
      state.isNavbarOpen = !state.isNavbarOpen;
    },
    setNavberState: (state, action) => {
      state.isNavbarOpen = action.payload;
    },
  },
});

// 각 action creator를 내보낸다.
export const { toggleNavbar, setNavberState } = navbarSlice.actions;

export const selectIsNavbarOpen = (state: RootState) => state.navbarReducer.isNavbarOpen;

// reducer를 내보낸다.
export default navbarSlice.reducer;
