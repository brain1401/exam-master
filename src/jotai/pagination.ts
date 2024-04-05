import { defaultPageSize } from "@/const/pageSize";
import { atom } from "jotai";

export const publicProblemSetsPageAtom = atom(1);
export const publicProblemSetsMaxPageAtom = atom<number | null>(null);
export const pageSizeAtom = atom(defaultPageSize);
export const problemSetsPageAtom = atom(1);
export const problemSetsMaxPageAtom = atom<number | null>(null);
export const resultPageAtom = atom(1);
export const resultMaxPageAtom = atom<number | null>(null);
export const userEmailAtom = atom<string | null>(null);

export const resetAction = atom(null, (_get, set) => {
  set(publicProblemSetsPageAtom, 1);
  set(publicProblemSetsMaxPageAtom, null);
  set(pageSizeAtom, defaultPageSize);
  set(problemSetsPageAtom, 1);
  set(problemSetsMaxPageAtom, null);
  set(resultPageAtom, 1);
  set(resultMaxPageAtom, null);
});