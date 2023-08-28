"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import {
  cardsAtom,
  currentCardAtom,
  currentCardIndexAtom,
} from "../jotai/store";
import { useAtom, useAtomValue } from "jotai";
import * as Tabs from "@radix-ui/react-tabs";
import ObjectiveTab from "./ObjectiveTab";
import SubjectiveTab from "./SubjectiveTab";
import { isCardOnBeingWrited } from "@/service/card";

export default function CreateProblemsCard() {
  const cards = useAtomValue(cardsAtom);
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  
  const [currentTab, setCurrentTab] = useState<"obj" | "sub">("obj");
  const currentIndex = useAtomValue(currentCardIndexAtom);

  useLayoutEffect(() => {
    //현재 탭 상태를 설정
    setCurrentTab(currentCard.type);
  }, [currentIndex, currentCard]);

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

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  return (
    <section className="flex justify-center items-center">
      <Tabs.Root
        className="flex flex-col md:w-[60rem] w-11/12"
        defaultValue={currentTab === "obj" ? "tab1" : "tab2"}
        activationMode="manual"
        value={currentTab === "obj" ? "tab1" : "tab2"}
      >
        <Tabs.List className="flex mb-2 justify-center md:justify-normal">
          <Tabs.Trigger
            className={`border border-gray-300 rounded-md px-5 py-3 mr-2 ${
              currentTab === "obj" && "bg-neutral-500 text-white"
            }`}
            value="tab1"
            onClick={() => {
              if (isCardOnBeingWrited(currentCard)) {
                const value = confirm(
                  "현재 문제에 입력된 내용이 삭제됩니다. 계속하시겠습니까?"
                );
                if (value === false) {
                  setCurrentTab("sub");
                  return;
                }
              }
              setCurrentTab("obj");
              setCurrentCard({
                type: "obj",
                question: "",
                additionalView: "",
                isAdditiondalViewButtonClicked: false,
                isImageButtonClicked: false,
                image: null,
                candidates: Array(4).fill({ text: "", isAnswer: false }),
                subAnswer: null,
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
            value="tab2"
            onClick={() => {
              if (isCardOnBeingWrited(currentCard)) {
                const value = confirm(
                  "현재 문제에 입력된 내용이 삭제됩니다. 계속하시겠습니까?"
                );
                if (value === false) {
                  setCurrentTab("obj");
                  return;
                }
              }
              setCurrentTab("sub");
              setCurrentCard({
                type: "sub",
                question: "",
                additionalView: "",
                image: null,
                isAdditiondalViewButtonClicked: false,
                isImageButtonClicked: false,
                subAnswer: "",
                candidates: null,
              });
            }}
            disabled={currentTab === "sub"}
          >
            주관식
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">
          {/*객관식*/}
          <ObjectiveTab />
        </Tabs.Content>
        <Tabs.Content value="tab2">
          {/*주관식*/}
          <SubjectiveTab />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
