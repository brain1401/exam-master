"use client";
import { useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import ObjectiveTab from "./ObjectiveTab";
import SubjectiveTab from "./SubjectiveTab";
import { isCardOnBeingWrited } from "@/service/problems";
import usePreventClose from "@/hooks/preventClose";
import {
  currentProblemAtom,
  currentTabAtom,
  problemsAtom,
  currentProblemIndexAtom,
} from "../../jotai/problems";
import { useAtom, useAtomValue } from "jotai";

export default function ProblemsEditor() {
  const [problems, setProblems] = useAtom(problemsAtom);
  const currentProblem = useAtomValue(currentProblemAtom);
  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);
  const problemCurrentIndex = useAtomValue(currentProblemIndexAtom);

  usePreventClose();

  const onTabChange = (tab: "obj" | "sub") => {
    if (isCardOnBeingWrited(currentProblem)) {
      const value = confirm(
        "현재 문제에 입력된 내용이 삭제됩니다. 계속하시겠습니까?",
      );
      if (value === false) return;
    }
    setCurrentTab(tab);
    setProblems((prev) => {
      const newProblems = [...prev];
      newProblems[problemCurrentIndex] = {
        id: prev[problemCurrentIndex]?.id,
        type: tab,
        question: "",
        additionalView: "",
        isAdditiondalViewButtonClicked: false,
        isImageButtonClicked: false,
        isAnswerMultiple: false,
        image: null,
        candidates:
          tab === "obj" ? Array(4).fill({ text: "", isAnswer: false }) : null,
        subAnswer: tab === "obj" ? null : "",
      };
      return newProblems;
    });
  };

  const getTriggerClassName = (tab: "obj" | "sub") => {
    let value = "";

    const BASIC_CLASS_NAME = "rounded-lg border border-gray-300 px-5 py-3";
    const ON_CURRENT_TAB = "bg-secondary text-main";

    if (tab === "obj") {
      value = `mr-2 ${BASIC_CLASS_NAME} ${
        currentTab === "obj" && ON_CURRENT_TAB
      }`;
    } else if (tab === "sub") {
      value = `${BASIC_CLASS_NAME} ${currentTab === "sub" && ON_CURRENT_TAB}`;
    }

    return value;
  };
  useEffect(() => {
    console.log(problems);
  }, [problems]);

  return (
    <section className="flex items-center justify-center">
      <Tabs.Root
        className="flex w-11/12 flex-col md:w-[60rem]"
        activationMode="manual"
        value={currentTab}
      >
        <Tabs.List className="mb-2 flex justify-center md:justify-normal">
          <Tabs.Trigger
            className={getTriggerClassName("obj")}
            value="obj"
            onClick={() => {
              onTabChange("obj");
            }}
            disabled={currentTab === "obj"}
          >
            객관식
          </Tabs.Trigger>

          <Tabs.Trigger
            className={getTriggerClassName("sub")}
            value="sub"
            onClick={() => {
              onTabChange("sub");
            }}
            disabled={currentTab === "sub"}
          >
            주관식
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="obj" asChild>
          {/*객관식*/}
          <ObjectiveTab />
        </Tabs.Content>
        <Tabs.Content value="sub" asChild>
          {/*주관식*/}
          <SubjectiveTab />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
