"use client";
import usePreventClose from "@/hooks/usePreventClose";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import Candidates from "./Candidates";
import SubjectiveAnswerTextarea from "./SubjectiveAnswerTextarea";
import SubmitButton from "./SubmitButton";
import ExamCardLayout from "../layouts/ExamCardLayout";
import useExamProblems from "@/hooks/useExamProblems";
import CurrentProblemIndicator from "./CurrentProblemIndicator";
import Image from "next/image";
import checkImage from "../../../../public/images/checkBlack.png";
import ProblemGridLayout from "../layouts/ProblemGridLayout";
import { isImageUrlObject } from "@/utils/problems";
import { ExamProblemSet } from "@/types/problems";
import { useEffect } from "react";

type Props = {
  examProblemSet: ExamProblemSet;
};
export default function ExamProblems({ examProblemSet }: Props) {
  const { currentExamProblemIndex, resetExamProblemAnswers } =
    useExamProblems();

  useEffect(() => {
    return () => {
      resetExamProblemAnswers();
    };
  }, [resetExamProblemAnswers]);

  usePreventClose();

  const currentExamProblem = examProblemSet.problems[currentExamProblemIndex];
  const examProblems = examProblemSet.problems;

  return (
    <ProblemGridLayout>
      <div>
        {/* preload images */}
        {examProblems &&
          examProblems.map((examProblem) => {
            const image = examProblem.image;
            if (image && isImageUrlObject(image)) {
              return (
                <Image
                  key={examProblem.uuid + "preload"}
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
        {Boolean(checkImage) && (
          <Image
            src={checkImage}
            alt="check image preload"
            priority
            className="hidden"
          />
        )}
      </div>
      <CurrentProblemIndicator
        examProblemLength={examProblemSet.problems.length}
      />

      <ExamCardLayout>
        <CurrentQuestion currentExamProblem={currentExamProblem} />

        <CurrentExamImage currentExamProblem={currentExamProblem} />

        <AdditionalView currentExamProblem={currentExamProblem} />

        {Boolean(currentExamProblem.type === "obj") && (
          <Candidates currentExamProblem={currentExamProblem} />
        )}

        {Boolean(currentExamProblem.type === "sub") && (
          <SubjectiveAnswerTextarea currentExamProblem={currentExamProblem} />
        )}
      </ExamCardLayout>

      <div className="flex items-center justify-center">
        <NextOrPrevButtons examProblemLength={examProblemSet.problems.length} />
      </div>

      <div className="flex items-center justify-center">
        <SubmitButton
          examProblemSet={examProblemSet}
          examProblems={examProblems}
        />
      </div>
    </ProblemGridLayout>
  );
}
