"use client";
import { useLayoutEffect } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import { initCurrentProblemAtom } from "@/jotai/problems";
import { useSetAtom } from "jotai";
import Candidates from "./Candidates";
import CandidateCountSelector from "./CandidateCountSelector";
import MultipleAnswerSwitch from "./MultipleAnswerSwitch";
import QuestionTextArea from "./QuestionTextArea";

export default function ObjectiveTab() {
  const initCurrentProblem = useSetAtom(initCurrentProblemAtom);

  useLayoutEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  return (
    <form
      className="flex flex-col rounded-xl bg-gray-100 p-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col">
        <QuestionTextArea />
      </div>

      <AddViewAndPhoto className="mt-4" />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center justify-center">
          <MultipleAnswerSwitch />
        </div>
        <div className="flex items-center justify-center">
          <CandidateCountSelector />
        </div>
      </div>

      <Candidates className="mt-4" />
    </form>
  );
}
