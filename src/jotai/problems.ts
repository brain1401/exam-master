import { Problem, candidate } from "@/types/problems";
import { atom } from "jotai";

export const problemsAtom = atom<Problem[]>(Array<Problem>(10).fill(null));

export const currentProblemIndexAtom = atom(0);

export const problemSetsNameAtom = atom("");
export const localProblemSetsNameAtom = atom("");

export const currentTabAtom = atom<"obj" | "sub">("obj");

export const currentProblemAtom = atom(
  (get) => {
    const problems = get(problemsAtom);
    const problemCurrentIndex = get(currentProblemIndexAtom);
    return problems[problemCurrentIndex];
  },
  (get, set, update: Partial<Problem>) => {
    const problems = get(problemsAtom);
    const problemCurrentIndex = get(currentProblemIndexAtom);
    set(
      problemsAtom,
      problems.map((problem, index) => {
        if (index === problemCurrentIndex) {
          return { ...problem, ...update } as Problem;
        }
        return problem;
      }),
    );
  },
);

export const currentProblemCandidatesAtom = atom(
  (get) => {
    const problem = get(currentProblemAtom);
    return problem?.candidates;
  },
  (get, set, update: candidate[]) => {
    set(currentProblemAtom, { candidates: update });
  },
);

export const initCurrentProblemAtom = atom(null, (get, set) => {
  const currentProblem = get(currentProblemAtom);
  const currentTab = get(currentTabAtom);


  currentProblem === null && set(currentProblemAtom, {
    id: undefined,
    type: currentTab === "obj" ? "obj" : "sub",
    question: "",
    additionalView: "",
    isAdditiondalViewButtonClicked: false,
    isImageButtonClicked: false,
    image: null,
    isAnswerMultiple: false,
    candidates:
      currentTab === "obj"
        ? Array.from(Array<candidate>(4), (_, i) => ({
            id: i,
            text: "",
            isAnswer: false,
          }))
        : null,
    subAnswer: currentTab === "obj" ? null : "",
  });
});

export const problemLengthAtom = atom("10");

export const candidatesCountAtom = atom("4");

export const resetProblemsAtom = atom(null, (get, set) => {
  set(problemsAtom, Array<Problem>(10).fill(null));
  set(currentProblemIndexAtom, 0);
  set(problemLengthAtom, "10");
  set(currentTabAtom, "obj");
  set(problemSetsNameAtom, "");
  set(localProblemSetsNameAtom, "");
  set(initCurrentProblemAtom);
});
