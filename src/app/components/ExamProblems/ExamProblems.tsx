"use client";
import usePreventClose from "@/hooks/preventClose";
import { useEffect } from "react";
import {
  currentExamProblemAtom,
  examProblemNameAtom,
} from "../../../jotai/examProblems";

import { useAtomValue } from "jotai";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import Candidates from "./Candidates";
import SubjectiveAnswerTextarea from "./SubjectiveAnswerTextarea";

export default function ExamProblems() {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);
  const name = useAtomValue(examProblemNameAtom);

  usePreventClose();

  useEffect(() => {
    console.log("currentExamProblem", currentExamProblem);
  }, [currentExamProblem]);

  if (!currentExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section className="h-full">
      <div>문제집 이름 : {name}</div>

      <div className="rounded-lg bg-slate-200 p-3">
        <CurrentQuestion />

        <CurrentExamImage />

        <AdditionalView />

        {currentExamProblem.type === "obj" && <Candidates />}

        {currentExamProblem.type === "sub" && <SubjectiveAnswerTextarea />}
      </div>

      <NextOrPrevButtons />
    </section>
  );
}
