"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import ObjectiveTab from "./ObjectiveTab";
import SubjectiveTab from "./SubjectiveTab";
import usePreventClose from "@/hooks/usePreventClose";
import useProblems from "@/hooks/useProblems";
import Image from "next/image";
import { isCardOnBeingWrited, isImageUrlObject } from "@/utils/problems";
import { Button } from "../ui/button";

const TRIGGER_CLASSNAME =
  "rounded-lg px-5 py-[1.4rem] disabled:opacity-100 data-[state=active]:bg-primary data-[state=inactive]:bg-primary/50 dark:data-[state=active]:text-black data-[state=active]:text-white";

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
      isAdditionalViewButtonClicked: false,
      isImageButtonClicked: false,
      isAnswerMultiple: false,
      image: null,
      candidates:
        tab === "obj" ? Array(4).fill({ text: "", isAnswer: false }) : null,
      subAnswer: tab === "obj" ? null : "",
    });
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
                  fill
                  priority
                  key={problem?.uuid + "preload"}
                />
              );
            }
          })}
      </div>
      <Tabs
        className="flex w-full flex-col"
        activationMode="manual"
        value={currentTab}
      >
        <TabsList className="mb-2 flex justify-center gap-x-2 bg-transparent md:justify-normal">
          <TabsTrigger
            value="obj"
            onClick={() => {
              onTabChange("obj");
            }}
            disabled={currentTab === "obj"}
            className={TRIGGER_CLASSNAME}
            asChild
          >
            <Button>객관식</Button>
          </TabsTrigger>

          <TabsTrigger
            className={TRIGGER_CLASSNAME}
            value="sub"
            onClick={() => {
              onTabChange("sub");
            }}
            disabled={currentTab === "sub"}
            asChild
          >
            <Button>주관식</Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="obj">
          {/*객관식*/}
          <ObjectiveTab />
        </TabsContent>
        <TabsContent value="sub">
          {/*주관식*/}
          <SubjectiveTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}
