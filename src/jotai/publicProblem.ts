import { atom } from "jotai";

export const publicProblemSetSortAtom = atom<"newest" | "popular">("popular");