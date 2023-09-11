"use client";
import ProblemsEditor from "../ProblemsEditor";
import CreateProblemsOption from "./CreateProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentCardIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import { resetCardsAtom } from "../../jotai/problems";
import { useSetAtom } from "jotai";

export default function CreateProblems() {
  const resetCard = useSetAtom(resetCardsAtom);

  useEffect(() => {

    return () => {
      resetCard();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="p-3 mt-10 max-w-[70rem] mx-auto">
      <CreateProblemsOption />
      <CurrentCardIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />
      <CreateProblemsSubmitButton />
    </section>
  );
}