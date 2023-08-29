"use client";
import CreateProblemsCard from "./CreateProblemsCard";
import CreateProblemsOption from "./CreateProblems/CreateProblemsOption";
import NextOrPrevButtons from "./CreateProblems/NextOrPrevButtons";
import CurrentCardIndicator from "./CreateProblems/CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblems/CreateProblemsSubmitButton";
import { useEffect } from "react";
import { resetCardsAtom } from "../jotai/store";
import { useSetAtom } from "jotai";

export default function CreateProblems() {
  const resetCard = useSetAtom(resetCardsAtom);

  useEffect(() => {
    return () => {
      resetCard();
    };
  }, [resetCard]);

  return (
    <section className="p-3 mt-10 max-w-[70rem] mx-auto">
      <CreateProblemsOption />
      <CurrentCardIndicator />

      <CreateProblemsCard />

      <NextOrPrevButtons />
      <CreateProblemsSubmitButton />
    </section>
  );
}
