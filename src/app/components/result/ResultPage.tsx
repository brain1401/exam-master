"use client";

import axios from "axios";
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
type Props = {
  UUID: string;
};
export default function ResultPage({ UUID }: Props) {
  const {
    setExamProblemResults,
    resetExamProblemResults,
    examProblemResults,
  } = useExamProblemResults();

  const [loading, setLoading] = useState(true);

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
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      resetExamProblemResults();
    };
  }, [UUID, setExamProblemResults, resetExamProblemResults]);

  useEffect(() => {
    console.log(examProblemResults);
  }, [examProblemResults]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={100} />
      </div>
    );

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
