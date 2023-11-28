"use client";

import useProblems from "@/hooks/useProblems";
import { isCardOnBeingWrited } from "@/service/problems";
import { candidate } from "@/types/problems";
import { Button } from "@nextui-org/react";

const BUTTON_CLASSNAMES = "bg-secondary text-white px-3 py-1";

export default function NextOrPrevButtons() {
  const {
    problems,
    setProblems,
    currentProblemIndex,
    setCurrentProblemIndex,
    currentTab,
    setCurrentTab,
  } = useProblems();

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
        window.scroll(0, 0);
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
        window.scroll(0, 0);
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
    <div className="mt-5 flex justify-center gap-5">
      <Button
        onClick={() => {
          showPreviousCard();
        }}
        radius="sm"
        className={BUTTON_CLASSNAMES}
      >
        이전
      </Button>
      <Button
        onClick={() => {
          showNextCard();
        }}
        radius="sm"
        className={BUTTON_CLASSNAMES}
      >
        다음
      </Button>
    </div>
  );
}
