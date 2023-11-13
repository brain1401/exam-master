"use client";
import usePreventClose from "@/hooks/preventClose";
import { useEffect } from "react";
import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import checkImage from "/public/check.png";
import { isImageUrlObject } from "@/service/problems";
import {
  currentExamProblemAtom,
  currentExamProblemIndexAtom,
  examProblemNameAtom,
  examProblemsAtom,
} from "../../../jotai/examProblems";
import { Textarea } from "@nextui-org/react";

import { useAtom, useAtomValue } from "jotai";
import { Problem } from "@/types/problems";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import ObjExamProblem from "./ObjExamProblem";
import SubExamProblem from "./SubExamProblem";

export default function ExamProblems() {
  const [currentExamProblem, setCurrentExamProblem] = useAtom(
    currentExamProblemAtom,
  );
  const [currentExamProblemIndex, setCurrentProblemIndex] = useAtom(
    currentExamProblemIndexAtom,
  );
  const [examProblems] = useAtom(examProblemsAtom);
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

        {currentExamProblem.type === "obj" && <ObjExamProblem />}

        {currentExamProblem.type === "sub" && <SubExamProblem />}
      </div>

      <NextOrPrevButtons />
    </section>
  );
}
