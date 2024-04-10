"use client";

import { mainStore, examStore } from "@/jotai/store/store";
import { Provider } from "jotai";

type Props = {
  children: React.ReactNode;
  storeType?: "main" | "exam" | "publicExam";
};

export default function JotaiProvider({ children, storeType }: Props) {
  const getStore = () => {
    switch (storeType) {
      case "main":
        return mainStore;
      case "exam":
        return examStore;
      default:
        return undefined;
    }
  };

  const store = getStore();
  return <Provider store={store}>{children}</Provider>;
}
