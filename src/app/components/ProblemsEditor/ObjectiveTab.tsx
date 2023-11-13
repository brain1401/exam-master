"use client";
import { useEffect } from "react";
import AddViewAndPhoto from "../ui/AddViewAndPhoto";
import { initCurrentProblemAtom } from "@/jotai/problems";
import { useSetAtom } from "jotai";
import Candidates from "./Candidates";
import CandidateCountSelector from "./CandidateCountSelector";
import MultipleAnswerCheckbox from "./MultipleAnswerCheckbox";
import QuestionTextArea from "./QuestionTextArea";

export default function ObjectiveTab() {
  const initCurrentProblem = useSetAtom(initCurrentProblemAtom);

  useEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  return (
    <form
      className="flex flex-col space-y-4 rounded-xl bg-gray-100 p-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col">
        <QuestionTextArea />
      </div>

      <AddViewAndPhoto />

      <div className="flex items-center justify-between">
        <div>
          <MultipleAnswerCheckbox />
        </div>
        <div className="flex items-center justify-center">
          <CandidateCountSelector />
        </div>
      </div>

      <Candidates />
    </form>
  );
}
