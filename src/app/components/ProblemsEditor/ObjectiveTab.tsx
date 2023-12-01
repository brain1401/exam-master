"use client";
import { useLayoutEffect } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import Candidates from "./Candidates";
import CandidateCountSelector from "./CandidateCountSelector";
import MultipleAnswerSwitch from "./MultipleAnswerSwitch";
import QuestionTextArea from "./QuestionTextArea";
import useProblems from "@/hooks/useProblems";
import ProblemEditorTabLayout from "../layouts/ProblemEditorTabLayout";

export default function ObjectiveTab() {
  const { initCurrentProblem } = useProblems();

  useLayoutEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  return (
    <ProblemEditorTabLayout>
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
    </ProblemEditorTabLayout>
  );
}
