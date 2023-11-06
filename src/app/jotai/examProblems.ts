import { Problem, ProblemSetWithName } from "@/types/problems";
import { atom } from "jotai";

export const examProblemsAtom = atom<ProblemSetWithName>({
  name: "",
  exam_problems: [],
});

export const currentExamProblemIndexAtom = atom(0);

export const currentExamProblemAtom = atom(
  (get) => {
    const examProblems = get(examProblemsAtom);
    const currentExamProblemIndex = get(currentExamProblemIndexAtom);

    return examProblems.exam_problems[currentExamProblemIndex];
  },
  (get, set, update: Problem) => {
    const newExamProblems = { ...get(examProblemsAtom) };
    const currentExamProblemIndex = get(currentExamProblemIndexAtom);

    newExamProblems.exam_problems[currentExamProblemIndex] = update;

    set(examProblemsAtom, newExamProblems);
  },
);

export const examProblemNameAtom = atom(
  (get) => {
    const examProblems = get(examProblemsAtom);
    return examProblems.name;
  },
  (get, set, update: string) => {
    const newExamProblems = get(examProblemsAtom);
    newExamProblems.name = update;
    set(examProblemsAtom, newExamProblems);
  },
);

export const resetExamProblemsAtom = atom(null, (_, set) => {
  set(examProblemsAtom, { name: "", exam_problems: [] });
  set(currentExamProblemIndexAtom, 0);
});