"use client";

import useProblems from "@/hooks/useProblems";
import useScrollEffect from "@/hooks/useScrollEffect";
import { Candidate } from "@/types/problems";
import { isCardOnBeingWrited } from "@/utils/problems";
import { Button } from "../ui/button";

const BUTTON_CLASSNAMES = "bg-[#454655] text-white px-[1.5rem] py-1";

export default function NextOrPrevButtons() {
  const {
    problems,
    setProblems,
    currentProblemIndex,
    setCurrentProblemIndex,
    currentTab,
    setCurrentTab,
  } = useProblems();

  const changeCurrentTab = (baseIndex: number) => {
    const prevProblem = problems?.[baseIndex - 1];
    const nextProblem = problems?.[baseIndex + 1];
    const currentProblem = problems?.[baseIndex];

    const newProblems = [...problems];
    //현재 문제가 바뀔 때마다 그 문제에 해당하는 탭으로 탭을 바꿔줌
    setCurrentTab(problems[baseIndex]?.type ?? currentTab);

    if (nextProblem && !isCardOnBeingWrited(nextProblem)) {
      newProblems[baseIndex + 1] = null;
    }
    if (prevProblem && !isCardOnBeingWrited(prevProblem)) {
      newProblems[baseIndex - 1] = null;
    }

    //바뀔 문제 객체 초기화
    if (isCardOnBeingWrited(currentProblem)) return;
    newProblems[baseIndex] = {
      uuid: problems[baseIndex]?.uuid,
      type: currentTab === "obj" ? "obj" : "sub",
      question: "",
      additionalView: "",
      isAdditiondalViewButtonClicked: false,
      isImageButtonClicked: false,
      image: null,
      isAnswerMultiple: false,
      candidates:
        currentTab === "obj"
          ? Array.from(Array<Candidate>(4), (_, i) => ({
              id: i,
              text: "",
              isAnswer: false,
            }))
          : null,

      subAnswer: currentTab === "obj" ? null : "",
    };

    setProblems(newProblems);
  };

  useScrollEffect([currentProblemIndex]);

  const showNextCard = () => {
    let flag = false;
    if (currentProblemIndex < problems.length - 1) {
      flag = true;
      setCurrentProblemIndex(currentProblemIndex + 1);
    }

    if (flag) {
      changeCurrentTab(currentProblemIndex + 1);
    }
  };

  const showPreviousCard = () => {
    let flag = false;

    if (currentProblemIndex > 0) {
      flag = true;
      setCurrentProblemIndex(currentProblemIndex - 1);
    }

    if (flag) {
      changeCurrentTab(currentProblemIndex - 1);
    }
  };

  return (
    <div className="mt-5 flex justify-center gap-5">
      <Button
        onClick={() => {
          showPreviousCard();
        }}
        className={BUTTON_CLASSNAMES}
      >
        이전
      </Button>
      <Button
        onClick={() => {
          showNextCard();
        }}
        className={BUTTON_CLASSNAMES}
      >
        다음
      </Button>
    </div>
  );
}
