"use client";

import { Provider } from "jotai";
import { createStore } from "jotai/vanilla";
type Store = ReturnType<typeof createStore>;

type Props = {
  children: React.ReactNode;
  store?: Store;
};

export default function JotaiProvider({ children, store }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
