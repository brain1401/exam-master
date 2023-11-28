"use client";
import axios, { isAxiosError } from "axios";
import { useEffect, useState, useRef } from "react";
import CurrentQuestion from "./CurrentQuestion";
import CurrentCandidates from "./CurrentCandidates";
import AdditionalView from "./AdditionalView";
import NextOrPrevButton from "./NextOrPrevButton";
import CurrentImage from "./CurrentImage";
import SubjectiveAnswered from "./SubjectiveAnswered";
import ExamCard from "../ui/ExamCard";
import useExamProblemResults from "@/hooks/useExamProblemResults";
import CorrectAnswer from "./CorrectAnswer";
import CustomLoading from "../ui/CustomLoading";
import CurrentProblemIndicator from "./CurrentProblemIndicator";
import { isImageUrlObject } from "@/service/problems";
import CorrectMark from "/public/images/correctCircle.png";
import WrongMark from "/public/images/wrong.png";
import checkImage from "/public/images/checkBlack.png";
import Image from "next/image";

type Props = {
  UUID: string;
};

export default function ResultPage({ UUID }: Props) {
  const { setExamProblemResults, resetExamProblemResults, examProblemResults } =
    useExamProblemResults();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string } | null>(null);

  const imagesRef = useRef([CorrectMark, WrongMark, checkImage]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/getExamResultByUUID`, {
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
    <>
      <section className="mx-auto my-10 max-w-[80rem] p-3">
        {examProblemResults &&
          examProblemResults.map((examProblem) => {
            const image = examProblem?.image?.[0];
            if (image && isImageUrlObject(image)) {
              return (
                <Image
                  key={examProblem.id + "preload"}
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`}
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
        <CurrentProblemIndicator />
        <ExamCard>
          <CurrentQuestion />

          <CurrentImage />

          <AdditionalView />

          <CurrentCandidates />

          <SubjectiveAnswered />

          <CorrectAnswer />
        </ExamCard>

        <NextOrPrevButton />
      </section>
    </>
  );
}
