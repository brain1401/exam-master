import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "@/slices/navbar";
import problemsReducer from "@/slices/problems";
import examProblemReducer from "@/slices/examProblems";
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      navbarReducer,
      problemsReducer,
      examProblemReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
