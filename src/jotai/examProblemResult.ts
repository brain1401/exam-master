import { ExamProblemResult } from "@/types/problems";
import { atom } from "jotai";

export const examProblemResultsAtom = atom<ExamProblemResult[]>([]);

export const examProblemResultsIndexAtom = atom<number>(0);

export const currentExamProblemResultAtom = atom(
  (get) => {
    const index = get(examProblemResultsIndexAtom);
    const examProblemResults = get(examProblemResultsAtom);
    return examProblemResults[index];
  },
  (get, set, update: Partial<ExamProblemResult>) => {
    const examProblemResults = get(examProblemResultsAtom);
    const index = get(examProblemResultsIndexAtom);
    const currentExamProblemResult = examProblemResults[index];

    const newExamProblemResult = [
      ...examProblemResults,
      {
        ...currentExamProblemResult,
        ...update,
      },
    ];

    set(examProblemResultsAtom, newExamProblemResult);
  },
);

export const resetExamProblemResultsAtom = atom(null, (get, set) => {
  set(examProblemResultsAtom, []);
  set(examProblemResultsIndexAtom, 0);
});
