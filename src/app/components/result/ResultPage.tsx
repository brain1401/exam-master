"use client";
import axios, { isAxiosError } from "axios";
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
import CustomLoading from "../ui/CustomLoading";
import CurrentProblemIndicator from "./CurrentProblemIndicator";
import CorrectMark from "/public/images/correctCircle.png";
import WrongMark from "/public/images/wrong.png";
import checkImage from "/public/images/checkBlack.png";
import Image from "next/image";
import { isImageUrlObject } from "@/utils/problems";
import { ExamResults, ProblemResult } from "@/types/problems";
type Props = {
  UUID: string;
};

export default function ResultPage({ UUID }: Props) {
  const { setExamProblemResults, resetExamProblemResults, examProblemResults } =
    useProblemResults();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string } | null>(null);

  const imagesRef = useRef([CorrectMark, WrongMark, checkImage]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get<ProblemResult[]>(`/api/getExamResultByUUID`, {
          params: {
            uuid: UUID,
          },
        });
        setExamProblemResults(res.data);
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      resetExamProblemResults();
    };
  }, [UUID, setExamProblemResults, resetExamProblemResults]);

  if (loading) return <CustomLoading className="mt-20" />;

  if (error)
    return <h1 className="mt-10 text-center text-2xl">{error.error}</h1>;

  return (
    <section className="mx-auto flex w-full max-w-[70rem] flex-col p-3 pb-8 pt-10">
      <div>
        {/* preload images */}
        {examProblemResults &&
          examProblemResults.map((examProblem) => {
            const image = examProblem?.image;
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
