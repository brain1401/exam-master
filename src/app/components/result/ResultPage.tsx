"use client";

import axios, { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
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
type Props = {
  UUID: string;
};
export default function ResultPage({ UUID }: Props) {
  const { setExamProblemResults, resetExamProblemResults } =
    useExamProblemResults();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{error: string} | null>(null);

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

  if (loading)
    return (
      <CustomLoading className="mt-20"/>
    );

  if (error)
    return <h1 className="mt-10 text-center text-2xl">{error.error}</h1>;

  return (
    <>
      <section className="mx-auto my-10 max-w-[80rem] p-3">
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
