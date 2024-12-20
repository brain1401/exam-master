import { ExamProblem, ExamProblemSet } from "@/types/problems";
import { problemShuffle } from "@/utils/problemShuffle";
import { atom } from "jotai";

export const publicExamProblemSetAtom = atom<ExamProblemSet | null>(null);

export const timeLimitAtom = atom<string>("0");

export const currentExamProblemIndexAtom = atom<number>(0);

export const isExamStartedAtom = atom<boolean>(false);

export const isRandomSelectedAtom = atom<boolean>(false);

export const isTimeOverAtom = atom<boolean>(false);

export const originalProblemsAtom = atom<ExamProblem[]>([]);

export const publicExamProblemsAtom = atom(
  (get) => {
    const publicExamProblemSet = get(publicExamProblemSetAtom);
    return publicExamProblemSet?.problems ?? [];
  },
  (get, set, newProblems: ExamProblem[]) => {
    const publicExamProblemSet = get(publicExamProblemSetAtom);
    const isTimeOver = get(isTimeOverAtom);

    if (publicExamProblemSet && isTimeOver === false) {
      set(publicExamProblemSetAtom, {
        ...publicExamProblemSet,
        problems: newProblems,
      });
    }
  },
);

export const setPublicExamProblemsRandomAtom = atom(null, (get, set) => {
  const problems = get(publicExamProblemsAtom);
  set(originalProblemsAtom, problems);

  const shuffledProblems = problemShuffle(problems);
  set(publicExamProblemsAtom, shuffledProblems);
});

export const setPublicExamProblemsOriginalAtom = atom(null, (get, set) => {
  const originalProblems = get(originalProblemsAtom);

  if (originalProblems.length === 0) return;

  const problems = get(originalProblemsAtom);
  set(publicExamProblemsAtom, problems);
});

export const currentPublicExamProblemAtom = atom(
  (get) => {
    const problems = get(publicExamProblemsAtom);
    const index = get(currentExamProblemIndexAtom);
    return problems[index];
  },
  (get, set, newProblem: ExamProblem) => {
    const problems = get(publicExamProblemsAtom);
    const index = get(currentExamProblemIndexAtom);
    const isTimeOver = get(isTimeOverAtom);
    if (isTimeOver) {
      return;
    }
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
    const isTimeOver = get(isTimeOverAtom);

    if (isTimeOver) {
      return;
    }
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
    const isTimeOver = get(isTimeOverAtom);

    if (isTimeOver) {
      return;
    }
    const newProblem = { ...problem, subAnswer: newSubAnswer };
    set(currentPublicExamProblemAtom, newProblem);
  },
);

export const resetPublicProblemExamAtom = atom(null, (_, set) => {
  set(isExamStartedAtom, false);
  set(isTimeOverAtom, false);
  set(currentExamProblemIndexAtom, 0);
  set(timeLimitAtom, "0");
  set(isRandomSelectedAtom, false);
  set(originalProblemsAtom, []);
  set(publicExamProblemsAtom, []);
});
