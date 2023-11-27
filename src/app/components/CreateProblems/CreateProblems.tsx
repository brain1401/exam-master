"use client";
import ProblemsEditor from "../ProblemsEditor/ProblemsEditor";
import ProblemsOption from "../ProblemsEditor/ProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentProblemIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import { resetProblemsAtom } from "@/jotai/problems";
import { useSetAtom } from "jotai";
import ProblemEditorLayout from "../ui/ProblemEditorLayout";

export default function CreateProblems() {
  const resetProblems = useSetAtom(resetProblemsAtom);

  useEffect(() => {
    return () => {
      resetProblems();
    };
  }, [resetProblems]);

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
