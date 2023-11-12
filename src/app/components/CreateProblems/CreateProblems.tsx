"use client";
import ProblemsEditor from "../ProblemsEditor";
import EditProblemsOption from "./EditProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentProblemIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import { resetProblemsAtom } from "@/jotai/problems";
import { useSetAtom } from "jotai";

export default function CreateProblems() {
  const resetProblems = useSetAtom(resetProblemsAtom);

  useEffect(() => {
    return () => {
      resetProblems();
    };
  }, [resetProblems]);

  return (
    <section className="mx-auto mt-10 h-full max-w-[70rem]">
      <EditProblemsOption />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <CreateProblemsSubmitButton />
    </section>
  );
}
