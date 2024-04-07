"use client";
import { useEffect, useState, useRef } from "react";
import CurrentQuestion from "./CurrentQuestion";
import CurrentCandidates from "./CurrentCandidates";
import AdditionalView from "./AdditionalView";
import NextOrPrevButton from "./NextOrPrevButton";
import CurrentImage from "./CurrentImage";
import SubjectiveAnswered from "./SubjectiveAnswered";
import ExamCardLayout from "../layouts/ExamCardLayout";
import useProblemResults from "@/hooks/useProblemResults";
import CorrectAnswer from "./CorrectAnswer";
import CurrentProblemIndicator from "./CurrentProblemIndicator";
import CorrectMark from "../../../public/images/correctCircle.png";
import WrongMark from "../../../public/images/wrong.png";
import checkImage from "../../../public/images/checkBlack.png";
import Image from "next/image";
import { isImageUrlObject } from "@/utils/problems";
import { ExamResultsSet, ProblemResult } from "@/types/problems";
import { useHydrateAtoms } from "jotai/utils";
import { examResultsSetAtom } from "@/jotai/examResult";
type Props = {
  _examResultsSet: ExamResultsSet;
};

export default function ResultPage({ _examResultsSet }: Props) {
  useHydrateAtoms([[examResultsSetAtom, _examResultsSet]]);

  const { resetExamProblemResults, examResults } =
    useProblemResults();

  useEffect(() => {
    return () => {
      resetExamProblemResults();
    };
  }, [resetExamProblemResults]);

  const imagesRef = useRef([CorrectMark, WrongMark, checkImage]);

  return (
    <section className="mx-auto flex w-full max-w-[70rem] flex-col p-3 pb-8 pt-10">
      <div>
        {/* preload images */}
        {examResults &&
          examResults.map((examResult) => {
            const image = examResult?.image;
            if (image && isImageUrlObject(image)) {
              return (
                <Image
                  key={examResult.uuid + "preload"}
                  src={image.url}
                  alt="preload image"
                  width={400}
                  height={400}
                  className="hidden"
                  priority
                />
              );
            }
          })}
        {imagesRef.current.map((image, index) => (
          <Image
            key={index + "etc preload"}
            src={image}
            alt="preload image"
            priority
            className="hidden"
          />
        ))}
      </div>
      <CurrentProblemIndicator />
      <ExamCardLayout>
        <CurrentQuestion />

        <CurrentImage />

        <AdditionalView />

        <CurrentCandidates />

        <SubjectiveAnswered />

        <CorrectAnswer />
      </ExamCardLayout>

      <NextOrPrevButton />
    </section>
  );
}
