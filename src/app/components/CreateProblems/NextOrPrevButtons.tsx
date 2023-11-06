"use client";
import {
  currentProblemIndexAtom,
  problemsAtom,
  currentTabAtom,
  currentProblemAtom,
} from "@/app/jotai/problems";
import { isCardOnBeingWrited } from "@/service/problems";
import { candidate } from "@/types/problems";
import { useAtomValue, useSetAtom, useAtom } from "jotai";

export default function NextOrPrevButtons() {
  const [problems, setProblems] = useAtom(problemsAtom);
  const [currentProblemIndex, setCurrentProblemIndex] = useAtom(
    currentProblemIndexAtom,
  );
  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);

  const changeCurrentTab = (direction: "f" | "b") => {
    const baseIndex =
      direction === "f" ? currentProblemIndex + 1 : currentProblemIndex - 1;

    const prevProblem = problems?.[baseIndex - 1];
    const nextProblem = problems?.[baseIndex + 1];

    //현재 문제가 바뀔 때마다 탭을 바꿔줌
    setCurrentTab((prev) => problems[baseIndex]?.type ?? prev);
    if (nextProblem && !isCardOnBeingWrited(nextProblem)) {
      setProblems((prev) => {
        const newCards = [...prev];
        newCards[baseIndex + 1] = null;
        return newCards;
      });
    }
    if (prevProblem && !isCardOnBeingWrited(prevProblem)) {
      setProblems((prev) => {
        const newCards = [...prev];
        newCards[baseIndex - 1] = null;
        return newCards;
      });
    }
  };

  const initCurrentProblem = (direction: "f" | "b") => {
    // 문제 인덱스가 변경(사용자가 이전, 다음 버튼으로 이동)될 때마다 입력폼 초기화
    // 현재 문제에 무언가 적혀있으면 초기화하지 않음
    const baseIndex =
      direction === "f" ? currentProblemIndex + 1 : currentProblemIndex - 1;

    const currentProblem = problems?.[baseIndex];

    if (isCardOnBeingWrited(currentProblem)) return;

    setProblems((prev) => {
      const newProblems = [...prev];
      newProblems[baseIndex] = {
        id: prev[baseIndex]?.id,
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
      };
      return newProblems;
    });
  };

  const showNextCard = () => {
    let flag = false;
    setCurrentProblemIndex((prevIndex) => {
      if (prevIndex < problems.length - 1) {
        window.scrollTo(0, 0);
        flag = true;
        return prevIndex + 1;
      } else {
        return prevIndex;
      }
    });

    if (flag) {
      changeCurrentTab("f");
      initCurrentProblem("f");
    }
  };

  const showPreviousCard = () => {
    let flag = false;
    setCurrentProblemIndex((prevIndex) => {
      if (prevIndex > 0) {
        window.scrollTo(0, 0);
        flag = true;
        return prevIndex - 1;
      } else {
        return prevIndex;
      }
    });

    if (flag) {
      changeCurrentTab("b");
      initCurrentProblem("b");
    }
  };

  return (
    <div className="mt-8 flex justify-center gap-5">
      <button
        onClick={() => {
          showPreviousCard();
        }}
        className="rounded-md border border-black px-5 py-2 hover:border-slate-300 hover:bg-slate-300"
      >
        이전
      </button>
      <button
        onClick={() => {
          showNextCard();
        }}
        className="rounded-md border border-black px-5 py-2 hover:border-slate-300 hover:bg-slate-300"
      >
        다음
      </button>
    </div>
  );
}
