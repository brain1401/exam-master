import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "@/slices/navbar";
import problemsReducer from "@/slices/problems";
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      navbarReducer,
      problemsReducer,
    },
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
