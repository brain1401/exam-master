import { Candidate, ExamProblem, ExamProblemSet } from "@/types/problems";
import { atom } from "jotai";

export const examProblemSetAtom = atom<ExamProblemSet | null>(null);

export const currentExamProblemIndexAtom = atom<number>(0);

export const isExamStartedAtom = atom(false);

export const isTimeOverAtom = atom(false);

export const examProblemsAtom = atom(
  (get) => {
    const examProblemSets = get(examProblemSetAtom);
    return examProblemSets?.problems;
  },
  (get, set, update: ExamProblem[]) => {
    const isTimeOver = get(isTimeOverAtom);
    set(examProblemSetAtom, (prevProblemSet) => {
      if (isTimeOver) return prevProblemSet;
      if (prevProblemSet) {
        return {
          ...prevProblemSet,
          problems: update,
        };
      }
      return null;
    });
  },
);

export const currentExamProblemAtom = atom(
  (get) => {
    const examProblems = get(examProblemsAtom);
    const currentExamProblemIndex = get(currentExamProblemIndexAtom);

    return examProblems?.[currentExamProblemIndex];
  },
  (get, set, update: Partial<ExamProblem>) => {
    const examProblems = get(examProblemsAtom);
    const currentExamProblemIndex = get(currentExamProblemIndexAtom);
    const isTimeOver = get(isTimeOverAtom);

    if (isTimeOver) return;

    if (!examProblems) return;

    const newExamProblems = [...examProblems];
    newExamProblems[currentExamProblemIndex] = {
      ...newExamProblems[currentExamProblemIndex],
      ...update,
    };

    set(examProblemsAtom, newExamProblems);
  },
);

export const currentExamProblemCandidatesAtom = atom(
  (get) => {
    const currentExamProblem = get(currentExamProblemAtom);
    return currentExamProblem?.candidates;
  },
  (get, set, update: Candidate[] | null) => {
    const isTimeOver = get(isTimeOverAtom);
    if (isTimeOver) return;

    set(currentExamProblemAtom, {
      candidates: update,
    });
  },
);

export const currentExamProblemSubAnswerAtom = atom(
  (get) => {
    const currentExamProblem = get(currentExamProblemAtom);
    return currentExamProblem?.subAnswer;
  },
  (get, set, update: string | null) => {
    const isTimeOver = get(isTimeOverAtom);
    if (isTimeOver) return;

    if (update === null) {
      set(currentExamProblemAtom, {
        subAnswer: "",
      });
    } else {
      set(currentExamProblemAtom, {
        subAnswer: update,
      });
    }
  },
);

export const examProblemSetNameAtom = atom(
  (get) => {
    const examProblemSets = get(examProblemSetAtom);
    return examProblemSets?.name;
  },
  (get, set, update: string) => {
    const examProblemSets = get(examProblemSetAtom);

    if (!examProblemSets) return;
    examProblemSets.name = update;
    set(examProblemSetAtom, examProblemSets);
  },
);

export const resetExamProblemAnswersAtom = atom(null, (get, set) => {
  set(currentExamProblemIndexAtom, 0);
  set(examProblemSetAtom, null);
  set(isExamStartedAtom, false);
  set(isTimeOverAtom, false);
  set(examProblemsAtom, []);
  set(currentExamProblemCandidatesAtom, null);
  set(currentExamProblemSubAnswerAtom, null);
  set(examProblemSetNameAtom, "");
});
