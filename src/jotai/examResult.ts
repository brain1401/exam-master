import { ExamResultsSet, ProblemResult } from "@/types/problems";
import { atom } from "jotai";

export const examResultsSetAtom = atom<ExamResultsSet>({} as ExamResultsSet);

export const currentExamResultIndexAtom = atom<number>(0);

export const currentExamResultAtom = atom(
  (get) => {
    const index = get(currentExamResultIndexAtom);
    const examResult = get(examResultsSetAtom);

    return examResult?.problemResults?.[index];
  },
  (get, set, update: ProblemResult) => {
    const index = get(currentExamResultIndexAtom);
    const examResult = get(examResultsSetAtom);

    if (examResult) {
      if (examResult.problemResults) {
        examResult.problemResults[index] = update;
        set(examResultsSetAtom, examResult);
      }
    }
  },
);

export const examResultsAtom = atom(
  (get) => {
    const examResult = get(examResultsSetAtom);

    return examResult.problemResults;
  },
  (get, set, update: ProblemResult[]) => {
    const examResult = get(examResultsSetAtom);

    if (examResult) {
      examResult.problemResults = update;
      set(examResultsSetAtom, examResult);
    }
  },
);

export const resetExamProblemResultsAtom = atom(null, (get, set) => {
  set(examResultsSetAtom, {} as ExamResultsSet);
  set(currentExamResultIndexAtom, 0);
});
