"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import ObjectiveTab from "./ObjectiveTab";
import SubjectiveTab from "./SubjectiveTab";
import { isCardOnBeingWrited } from "@/service/problems";
import { Problem } from "@/types/problems";

type Props = {
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  problemCurrentIndex: number;
};
export default function ProblemsEditor({
  problems,
  setProblems,
  problemCurrentIndex,
}: Props) {
  const currentProblem = problems[problemCurrentIndex];
  const [currentTab, setCurrentTab] = useState<"obj" | "sub">("obj");

  useLayoutEffect(() => {
    const prevProblem = problems?.[problemCurrentIndex - 1];
    const nextProblem = problems?.[problemCurrentIndex + 1];

    //현재 카드가 바뀔 때마다 탭을 바꿔줌
    setCurrentTab((prev) => currentProblem?.type ?? prev);
    if (nextProblem && !isCardOnBeingWrited(nextProblem)) {
      setProblems((prev) => {
        const newCards = [...prev];
        newCards[problemCurrentIndex + 1] = null;
        return newCards;
      });
    }
    if (prevProblem && !isCardOnBeingWrited(prevProblem)) {
      setProblems((prev) => {
        const newCards = [...prev];
        newCards[problemCurrentIndex - 1] = null;
        return newCards;
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemCurrentIndex]);

  useEffect(() => {
    //페이지를 닫거나 새로고침을 할 때 경고창을 띄우는 이벤트 리스너 등록 및 해제
    function preventClose(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = ""; //Chrome에서 동작하도록; deprecated
    }

    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  return (
    <section className="flex justify-center items-center">
      <Tabs.Root
        className="flex flex-col md:w-[60rem] w-11/12"
        activationMode="manual"
        value={currentTab}
      >
        <Tabs.List className="flex mb-2 justify-center md:justify-normal">
          <Tabs.Trigger
            className={`border border-gray-300 rounded-md px-5 py-3 mr-2 ${
              currentTab === "obj" && "bg-neutral-500 text-white"
            }`}
            value="obj"
            onClick={() => {
              if (isCardOnBeingWrited(currentProblem)) {
                const value = confirm(
                  "현재 문제에 입력된 내용이 삭제됩니다. 계속하시겠습니까?"
                );
                if (value === false) return;
              }
              setCurrentTab("obj");
              setProblems((prev) => {
                const newProblems = [...prev];
                newProblems[problemCurrentIndex] = {
                  type: "obj",
                  question: "",
                  additionalView: "",
                  isAdditiondalViewButtonClicked: false,
                  isImageButtonClicked: false,
                  image: null,
                  candidates: Array(4).fill({ text: "", isAnswer: false }),
                  subAnswer: null,
                };
                return newProblems;
              });
            }}
            disabled={currentTab === "obj"}
          >
            객관식
          </Tabs.Trigger>

          <Tabs.Trigger
            className={`border border-gray-300 rounded-md px-5 py-3 ${
              currentTab === "sub" && "bg-neutral-500 text-white"
            }`}
            value="sub"
            onClick={() => {
              if (isCardOnBeingWrited(currentProblem)) {
                const value = confirm(
                  "현재 문제에 입력된 내용이 삭제됩니다. 계속하시겠습니까?"
                );
                if (value === false) return;
              }
              setCurrentTab("sub");
               setProblems((prev) => {
                 const newProblems = [...prev];
                 newProblems[problemCurrentIndex] = {
                   type: "sub",
                   question: "",
                   additionalView: "",
                   isAdditiondalViewButtonClicked: false,
                   isImageButtonClicked: false,
                   image: null,
                   candidates: null,
                   subAnswer: "",
                 };
                 return newProblems;
               });
            }}
            disabled={currentTab === "sub"}
          >
            주관식
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="obj">
          {/*객관식*/}
          <ObjectiveTab
            problemCurrentIndex={problemCurrentIndex}
            problems={problems}
            setProblems={setProblems}
          />
        </Tabs.Content>
        <Tabs.Content value="sub">
          {/*주관식*/}
          <SubjectiveTab
            problemCurrentIndex={problemCurrentIndex}
            problems={problems}
            setProblems={setProblems}
          />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
