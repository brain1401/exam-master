"use client";
import ProblemsEditor from "../ProblemsEditor/ProblemsEditor";
import ProblemsOption from "../ProblemsEditor/ProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentProblemIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import useProblems from "@/hooks/useProblems";
import ProblemEditorLayout from "../layouts/ProblemEditorLayout";

export default function CreateProblems() {
  const { resetProblems, currentProblem, problemSetIsPublic } = useProblems();

  useEffect(() => {
    return () => {
      resetProblems();
    };
  }, [resetProblems]);

  useEffect(() => {
    console.log(currentProblem);
  }, [currentProblem]);

  useEffect(() => {
    console.log("problemSetIsPublic :",problemSetIsPublic);
  }, [problemSetIsPublic]);

  return (
    <ProblemEditorLayout>
      <ProblemsOption />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <CreateProblemsSubmitButton />
    </ProblemEditorLayout>
  );
}
