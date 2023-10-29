"use client";
import ProblemsEditor from "../ProblemsEditor";
import EditProblemsOption from "./EditProblemsOption";
import NextOrPrevButtons from "./NextOrPrevButtons";
import CurrentCardIndicator from "./CurrentCardIndicator";
import CreateProblemsSubmitButton from "./CreateProblemsSubmitButton";
import { useEffect } from "react";
import useProblems from "@/hooks/problems";

export default function CreateProblems() {
  const {
    problems,
    setProblems,
    problemCurrentIndex,
    problemSetsName,
    setProblemCurrentIndex,
    setProblemSetsName,
    resetProblems,
  } = useProblems();

  useEffect(() => {
    return () => {
      resetProblems();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto mt-10 max-w-[70rem] p-3">
      <EditProblemsOption
        problems={problems}
        setProblems={setProblems}
        setProblemCurrentIndex={setProblemCurrentIndex}
        problemSetsName={problemSetsName}
        setProblemSetsName={setProblemSetsName}
      />
      <CurrentCardIndicator
        problemCurrentIndex={problemCurrentIndex}
        problemsLength={problems.length}
      />
      <ProblemsEditor
        problemCurrentIndex={problemCurrentIndex}
        problems={problems}
        setProblems={setProblems}
      />

      <NextOrPrevButtons
        problemLength={problems.length}
        setCurrentProblemIndex={setProblemCurrentIndex}
      />
      <CreateProblemsSubmitButton
        problemSetName={problemSetsName}
        problems={problems}
        setProblemSetsName={setProblemSetsName}
        resetProblems={resetProblems}
      />
    </section>
  );
}
