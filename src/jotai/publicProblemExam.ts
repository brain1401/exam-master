import { ExamProblem, PublicExamProblemSet } from "@/types/problems";
import { atom } from "jotai";

export const publicExamProblemSetAtom = atom<PublicExamProblemSet | null>(null);

export const timeLimitAtom = atom<string>("0");

export const currentExamProblemIndexAtom = atom<number>(0);

export const isExamStartedAtom = atom<boolean>(false);

export const publicExamProblemsAtom = atom(
  (get) => {
    const publicExamProblemSet = get(publicExamProblemSetAtom);
    return publicExamProblemSet?.problems ?? [];
  },
  (get, set, newProblems: ExamProblem[]) => {
    const publicExamProblemSet = get(publicExamProblemSetAtom);
    if (publicExamProblemSet) {
      set(publicExamProblemSetAtom, {
        ...publicExamProblemSet,
        problems: newProblems,
      });
    }
  },
);

export const currentPublicExamProblemAtom = atom(
  (get) => {
    const problems = get(publicExamProblemsAtom);
    const index = get(currentExamProblemIndexAtom);
    return problems[index];
  },
  (get, set, newProblem: ExamProblem) => {
    const problems = get(publicExamProblemsAtom);
    const index = get(currentExamProblemIndexAtom);
    const newProblems = [...problems];
    newProblems[index] = newProblem;
    set(publicExamProblemsAtom, newProblems);
  },
);

export const currentPublicExamProblemCandidatesAtom = atom(
  (get) => {
    const problem = get(currentPublicExamProblemAtom);
    return problem.candidates;
  },
  (get, set, newCandidates: ExamProblem["candidates"]) => {
    const problem = get(currentPublicExamProblemAtom);
    const newProblem = { ...problem, candidates: newCandidates };
    set(currentPublicExamProblemAtom, newProblem);
  },
);

export const currentPublicExamProblemSubAnswerAtom = atom(
  (get) => {
    const problem = get(currentPublicExamProblemAtom);
    return problem.subAnswer;
  },
  (get, set, newSubAnswer: ExamProblem["subAnswer"]) => {
    const problem = get(currentPublicExamProblemAtom);
    const newProblem = { ...problem, subAnswer: newSubAnswer };
    set(currentPublicExamProblemAtom, newProblem);
  },
);
