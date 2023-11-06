"use client";
import ProblemsEditor from "../ProblemsEditor";
import EditProblemsOption from "./EditProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentProblemIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import { resetProblemsAtom } from "@/app/jotai/problems";
import { useSetAtom } from "jotai";

export default function CreateProblems() {
  const resetProblems = useSetAtom(resetProblemsAtom);

  useEffect(() => {
    return () => {
      resetProblems();
    };
  }, [resetProblems]);

  return (
    <section className="mx-auto mt-10 max-w-[70rem] p-3">
      <EditProblemsOption />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <CreateProblemsSubmitButton />
    </section>
  );
}
