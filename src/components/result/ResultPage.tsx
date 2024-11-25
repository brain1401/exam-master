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
import Image from "next/image";
import { isImageUrlObject } from "@/utils/problems";
import { ExamResultsSet } from "@/types/problems";
import { useHydrateAtoms } from "jotai/utils";
import { examResultsSetAtom } from "@/jotai/examResult";
import { Button } from "../ui/button";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

type Props = {
  _examResultsSet: ExamResultsSet;
};

export default function ResultPage({ _examResultsSet }: Props) {
  useHydrateAtoms([[examResultsSetAtom, _examResultsSet]]);
  const [showDetails, setShowDetails] = useState(false);

  const {
    resetExamProblemResults,
    examResultsSet,
    examResults,
    currentExamResult: { candidates },
  } = useProblemResults();

  useEffect(() => {
    return () => {
      resetExamProblemResults();
    };
  }, [resetExamProblemResults]);

  useEffect(() => {
    console.log("candidates :", candidates);
  }, [candidates]);

  useEffect(() => {
    console.log("examResults :", examResults);
  }, [examResults]);

  const imagesRef = useRef([CorrectMark, WrongMark]);

  const correctCount =
    examResults?.filter((result) => result.isCorrect).length || 0;
  const totalCount = examResults?.length || 0;
  const correctRate =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // 합격 기준 점수 (예: 60%)
  const PASS_THRESHOLD = 60;
  const isPassed = correctRate >= PASS_THRESHOLD;

  // 처음 렌더링될 때 애니메이션 효과
  useEffect(() => {
    if (!showDetails && isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [showDetails, isPassed]);

  if (!showDetails) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-[70rem] flex-col items-center p-3 pb-8 pt-10"
      >
        <h1 className="mb-8 text-3xl font-bold">
          {examResultsSet.problemSetName} 시험 결과
        </h1>

        <div className="mb-12 h-48 w-48">
          <CircularProgressbar
            value={correctRate}
            text={`${correctRate}%`}
            styles={buildStyles({
              pathColor: isPassed ? "#22c55e" : "#ef4444",
              textColor: isPassed ? "#22c55e" : "#ef4444",
              trailColor: "#d6d6d6",
              pathTransitionDuration: 1,
            })}
          />
        </div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex flex-col items-center space-y-4 text-center"
        >
          <div className="text-2xl font-bold">
            {isPassed ? (
              <span className="text-green-500">축하합니다! 합격입니다!</span>
            ) : (
              <span className="text-red-500">
                아쉽습니다. 다시 도전해보세요!
              </span>
            )}
          </div>
          <div className="text-2xl">
            총 <span className="font-semibold">{totalCount}</span>문제 중{" "}
            <span
              className={`font-semibold ${isPassed ? "text-green-600" : "text-red-500"}`}
            >
              {correctCount}
            </span>
            문제 정답
          </div>
        </motion.div>

        <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowDetails(true)}
              className="w-full bg-blue-500 px-6 py-2 text-lg hover:bg-blue-600"
            >
              문제별 결과 보기
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full px-6 py-2 text-lg"
            >
              홈으로 가기
            </Button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

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
                  fill
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
      <div className="mb-4 flex items-center justify-between">
        <CurrentProblemIndicator />
        <Button
          variant="outline"
          onClick={() => setShowDetails(false)}
          className="px-4"
        >
          결과 요약으로 돌아가기
        </Button>
      </div>
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
