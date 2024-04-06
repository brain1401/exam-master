import { Problem, Candidate } from "@/types/problems";
import { atom } from "jotai";

export const problemsAtom = atom<Problem[]>(
  Array.from(Array<Problem>(10), (_, i) =>
    i === 0
      ? {
          id: undefined,
          type: "obj" as "obj" | "sub",
          isPublic: false,
          question: "",
          additionalView: "",
          isAdditionalViewButtonClicked: false,
          isImageButtonClicked: false,
          image: null,
          isAnswerMultiple: false,
          candidates: Array.from(Array<Candidate>(4), (_, i) => ({
            id: i,
            text: "",
            isAnswer: false,
          })),

          subAnswer: null,
        }
      : null,
  ),
);

export const isPublicAtom = atom(false);

export const currentProblemIndexAtom = atom(0);

export const currentTabAtom = atom<"obj" | "sub">("obj");

export const problemSetsNameAtom = atom("");

export const descriptionAtom = atom("");

export const timeLimitAtom = atom("20");

export const localProblemSetsNameAtom = atom("");

export const problemLengthAtom = atom("10");

export const candidatesCountAtom = atom("4");

export const resetProblemsAtom = atom(null, (get, set) => {
  set(
    problemsAtom,
    Array.from(Array<Problem>(10), (_, i) =>
      i === 0
        ? {
            id: undefined,
            type: "obj" as "obj" | "sub",
            isPublic: false,
            question: "",
            additionalView: "",
            isAdditionalViewButtonClicked: false,
            isImageButtonClicked: false,
            image: null,
            isAnswerMultiple: false,
            candidates: Array.from(Array<Candidate>(4), (_, i) => ({
              id: i,
              text: "",
              isAnswer: false,
            })),

            subAnswer: null,
          }
        : null,
    ),
  );
  set(isPublicAtom, false);
  set(currentProblemIndexAtom, 0);
  set(currentTabAtom, "obj");
  set(problemSetsNameAtom, "");
  set(descriptionAtom, "");
  set(localProblemSetsNameAtom, "");
  set(problemLengthAtom, "10");
  set(candidatesCountAtom, "4");
});

export const initCurrentProblemAtom = atom(null, (get, set) => {
  const currentTab = get(currentTabAtom);
  const currentProblemIndex = get(currentProblemIndexAtom);
  const problems = get(problemsAtom);

  if (problems[currentProblemIndex] === null) {
    problems[currentProblemIndex] = {
      uuid: undefined,
      type: currentTab,
      question: "",
      additionalView: "",
      isAdditionalViewButtonClicked: false,
      isImageButtonClicked: false,
      image: null,
      isAnswerMultiple: false,
      candidates: Array.from(Array<Candidate>(4), (_, i) => ({
        id: i,
        text: "",
        isAnswer: false,
      })),

      subAnswer: currentTab === "obj" ? null : "",
    };
  }

  set(problemsAtom, problems);
});

export const currentProblemAtom = atom(
  (get) => {
    const currentProblemIndex = get(currentProblemIndexAtom);
    const problems = get(problemsAtom);

    return problems[currentProblemIndex];
  },
  (_get, set, update: Partial<Problem>) => {
    set(problemsAtom, (prev) => {
      const currentProblemIndex = _get(currentProblemIndexAtom);
      const problems = [...prev];
      problems[currentProblemIndex] = {
        ...problems[currentProblemIndex],
        ...(update as NonNullable<Problem>),
      };
      return problems;
    });
  },
);

export const currentProblemCandidatesAtom = atom(
  (get) => {
    const currentProblemIndex = get(currentProblemIndexAtom);
    const problems = get(problemsAtom);

    return problems[currentProblemIndex]?.candidates;
  },
  (get, set, update: Candidate[]) => {
    set(problemsAtom, (prev) => {
      const currentProblemIndex = get(currentProblemIndexAtom);
      const problems = [...prev];
      problems[currentProblemIndex] = {
        ...problems[currentProblemIndex],
        candidates: update,
      } as NonNullable<Problem>;
      return problems;
    });
  },
);
