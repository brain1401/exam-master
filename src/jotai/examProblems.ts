import { ExamProblem, ExamProblemSet } from "@/types/problems";
import { atom } from "jotai";

export const examProblemSetAtom = atom<ExamProblemSet>({
  name: "",
  problems: [],
  uuid: "",
});

export const currentExamProblemIndexAtom = atom<number>(0);

export const examProblemsAtom = atom(
  (get) => {
    const examProblemSets = get(examProblemSetAtom);
    return examProblemSets.problems;
  },
  (get, set, update: ExamProblem[]) => {
    set(examProblemSetAtom, (prevProblemSet) => ({
      ...prevProblemSet,
      problems: update,
    }));
  },
);


export const currentExamProblemAtom = atom(
  (get) => {
    const examProblems = get(examProblemsAtom);
    const currentExamProblemIndex = get(currentExamProblemIndexAtom);

    return examProblems[currentExamProblemIndex];
  },
  (get, set, update: Partial<ExamProblem>) => {
    const examProblems = get(examProblemsAtom);
    const currentExamProblemIndex = get(currentExamProblemIndexAtom);

    const newExamProblems = [...examProblems];
    newExamProblems[currentExamProblemIndex] = {
      ...newExamProblems[currentExamProblemIndex],
      ...update,
    };

    set(examProblemsAtom, newExamProblems);
  },
);


export const examProblemSetNameAtom = atom(
  (get) => {
    const examProblemSets = get(examProblemSetAtom);
    return examProblemSets.name;
  },
  (get, set, update: string) => {
    const examProblemSets = get(examProblemSetAtom);
    examProblemSets.name = update;
    set(examProblemSetAtom, examProblemSets);
  },
);

export const resetExamProblemAnswersAtom = atom(null, (get, set) => {
  set(currentExamProblemIndexAtom, 0);
  set(examProblemSetAtom, {
    name: "",
    problems: [],
    uuid: "",
  });
});
