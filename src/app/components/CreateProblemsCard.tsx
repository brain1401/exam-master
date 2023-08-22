"use client";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import ObjectiveTab from "./ObjectiveTab";
import SubjectiveTab from "./SubjectiveTab";
import { useCardContext } from "@/context/CardContext";

export default function CreateProblemsCard() {
  const { cards, setCards, currentIndex } = useCardContext();
  const [currentTab, setCurrentTab] = useState<"obj" | "sub">("obj");

  useEffect(() => {
    //현재 탭 상태를 설정
    setCurrentTab(cards[currentIndex].type);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleDefaultTab = () => {
    let defaultTab = "";
    if (currentIndex !== 0) {
      cards[currentIndex - 1].type === "obj"
        ? (defaultTab = "tab1")
        : (defaultTab = "tab2");
    } else {
      cards[currentIndex]?.type === "obj"
        ? (defaultTab = "tab1")
        : (defaultTab = "tab2");
    }
    return defaultTab;
  };

  return (
    <section className="flex justify-center items-center">
      <Tabs.Root
        className="flex flex-col w-9/12"
        defaultValue={handleDefaultTab()}
        activationMode="manual"
        value={currentTab === "obj" ? "tab1" : "tab2"}
      >
        <Tabs.List className="flex mb-2">
          <Tabs.Trigger
            className={`border border-gray-300 rounded-md px-5 py-3 mr-2 ${
              currentTab === "obj" && "bg-neutral-500 text-white"
            }`}
            value="tab1"
            onClick={() => {
              setCurrentTab("obj");
              setCards((prevCards) => {
                const newCards = [...prevCards];
                newCards[currentIndex] = {
                  type: "obj",
                  question: "",
                  additionalView: "",
                  additiondalViewClicked: false,
                  imageButtonClicked: false,
                  image: null,
                  candidates: [],
                  subAnswer: null,
                };

                return newCards;
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
              setCurrentTab("sub");
              setCards((prevCards) => {
                const newCards = [...prevCards];
                newCards[currentIndex] = {
                  type: "sub",
                  question: "",
                  additionalView: "",
                  image: null,
                  additiondalViewClicked: false,
                  imageButtonClicked: false,
                  subAnswer: "",
                  candidates: null,
                };

                return newCards;
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
