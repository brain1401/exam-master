import { atom } from "jotai";

export const publicProblemSetSortAtom = atom<"newest" | "popular">("popular");

export const publicProblemSetSearchStringAtom = atom<string>("");