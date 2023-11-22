"use client";
import usePreventClose from "@/hooks/preventClose";
import { useEffect, useState } from "react";
import {
  currentExamProblemAtom,
  examProblemsAtom,
  resetExamProblemsAtom,
} from "../../../jotai/examProblems";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import Candidates from "./Candidates";
import SubjectiveAnswerTextarea from "./SubjectiveAnswerTextarea";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import SubmitButton from "./SubmitButton";

type Props = {
  UUID: string;
};
export default function ExamProblems({ UUID }: Props) {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);
  const [examProblems, setExamProblems] = useAtom(examProblemsAtom);
  const resetExamProblems = useSetAtom(resetExamProblemsAtom);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  usePreventClose();

  useEffect(() => {
    console.log("examProblems", examProblems);
  }, [examProblems]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/getExamProblemsByProblemSetUUID`, {
        params: {
          UUID,
        },
      })
      .then((res) => {
        setExamProblems({
          id: res.data.id,
          name: res.data.name,
          exam_problems: res.data.exam_problems,
        });
      })
      .catch((err) => {
        setError(err.response?.data.error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetExamProblems();
    };
  }, [UUID, setExamProblems, resetExamProblems]);

  if (error) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-2xl text-center">{error}</div>
    </div>
  )
  
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={100} />
      </div>
    );

  if (!currentExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section className="mx-auto my-10 max-w-[80rem] p-3">

      <div className="rounded-lg bg-slate-200 p-3">
        <CurrentQuestion />

        <CurrentExamImage />

        <AdditionalView />

        {currentExamProblem.type === "obj" && <Candidates />}

        {currentExamProblem.type === "sub" && <SubjectiveAnswerTextarea />}
      </div>

      <NextOrPrevButtons />

      <SubmitButton/>
    </section>
  );
}
