import { ExamProblem } from "@/types/problems";
import { atom } from "jotai";

export const timeLimitAtom = atom<string>("0");

export const currentExamProblemIndexAtom = atom<number>(0);

export const isExamStartedAtom = atom<boolean>(false);

export const publicExamProblemsAtom = atom<ExamProblem[]>([]);

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
