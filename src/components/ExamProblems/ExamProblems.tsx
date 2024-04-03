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
import checkImage from "../../../public/images/checkBlack.png";
import ProblemGridLayout from "../layouts/ProblemGridLayout";
import { isImageUrlObject } from "@/utils/problems";
import { ExamProblemSet } from "@/types/problems";
import { useEffect } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { useHydrateAtoms } from "jotai/utils";
import { examProblemSetAtom } from "@/jotai/examProblems";
type Props = {
  examProblemSet: ExamProblemSet;
};
export default function ExamProblems({ examProblemSet }: Props) {
  useHydrateAtoms([[examProblemSetAtom, examProblemSet]]);

  const { currentExamProblem, examProblems, resetExamProblems } =
    useExamProblems();
  const { revalidateAllPath } = useRevalidation();

  useEffect(() => {
    console.log("examProblemSet", examProblemSet);
  }, [examProblemSet]);

  useEffect(() => {
    // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
    revalidateAllPath();

    return () => {
      resetExamProblems();
    };
  }, [revalidateAllPath, resetExamProblems]);

  usePreventClose();

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
      <CurrentProblemIndicator />

      <ExamCardLayout>
        <CurrentQuestion />

        <CurrentExamImage />

        <AdditionalView />

        {Boolean(currentExamProblem.type === "obj") && <Candidates />}

        {Boolean(currentExamProblem.type === "sub") && (
          <SubjectiveAnswerTextarea />
        )}
      </ExamCardLayout>

      <div className="flex items-center justify-center">
        <NextOrPrevButtons />
      </div>

      <div className="flex items-center justify-center">
        <SubmitButton />
      </div>
    </ProblemGridLayout>
  );
}
