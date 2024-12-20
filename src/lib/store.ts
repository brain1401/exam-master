import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "@/slices/navbar";
import mediaQueryReducer from "@/slices/mediaQuery";
import pagenationReducer from "@/slices/pagenation";
import uiReducer from "@/slices/ui";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      navbarReducer,
      mediaQueryReducer,
      pagenationReducer,
      uiReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
