"use client";
import * as Tabs from "@radix-ui/react-tabs";
import ObjectiveTab from "./ObjectiveTab";
import SubjectiveTab from "./SubjectiveTab";
import usePreventClose from "@/hooks/usePreventClose";
import useProblems from "@/hooks/useProblems";
import Image from "next/image";
import { isCardOnBeingWrited, isImageUrlObject } from "@/utils/problems";

export default function ProblemsEditor() {
  const {
    setCurrentProblem,
    currentProblem,
    currentTab,
    problems,
    setCurrentTab,
  } = useProblems();

  usePreventClose();
  
  const onTabChange = (tab: "obj" | "sub") => {
    if (isCardOnBeingWrited(currentProblem)) {
      const value = confirm(
        "현재 문제에 입력된 내용이 삭제됩니다. 계속하시겠습니까?",
      );
      if (value === false) return;
    }
    setCurrentTab(tab);
    setCurrentProblem({
      uuid: currentProblem?.uuid,
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
  return (
    <section className="mx-auto flex max-w-[60rem] flex-col items-center justify-center">
      <div>
        {/* preload images */}
        {problems &&
          problems.map((problem) => {
            if (problem && problem.image && isImageUrlObject(problem.image)) {
              const image = problem.image;
              return (
                <Image
                  src={image.url}
                  alt="preload image"
                  className="hidden"
                  height={400}
                  width={400}
                  priority
                  key={problem?.uuid + "preload"}
                />
              );
            }
          })}
      </div>
      <Tabs.Root
        className="flex w-full flex-col overflow-y-hidden"
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
