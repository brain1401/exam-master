"use client";
import ProblemsEditor from "../ProblemsEditor/ProblemsEditor";
import ProblemsOption from "../ProblemsEditor/ProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentProblemIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import ProblemLayout from "../ui/ProblemLayout";
import useProblems from "@/hooks/useProblems";

export default function CreateProblems() {
  const { resetProblems } = useProblems();

  useEffect(() => {
    return () => {
      resetProblems();
    };
  }, [resetProblems]);

  return (
    <ProblemLayout>
      <ProblemsOption />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <CreateProblemsSubmitButton />
    </ProblemLayout>
  );
}
