"use client";
import usePreventClose from "@/hooks/preventClose";
import { useEffect, useState } from "react";
import {
  currentExamProblemAtom,
  examProblemNameAtom,
  examProblemsAtom,
  resetExamProblemsAtom,
} from "../../../jotai/examProblems";

import { useAtomValue, useSetAtom } from "jotai";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import Candidates from "./Candidates";
import SubjectiveAnswerTextarea from "./SubjectiveAnswerTextarea";
import { ClipLoader } from "react-spinners";
import axios from "axios";

type Props = {
  UUID: string;
};
export default function ExamProblems({ UUID }: Props) {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);
  const name = useAtomValue(examProblemNameAtom);
  const setExamProblems = useSetAtom(examProblemsAtom);
  const resetExamProblems = useSetAtom(resetExamProblemsAtom);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  usePreventClose();

  useEffect(() => {
    console.log("currentExamProblem", currentExamProblem);
  }, [currentExamProblem]);

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
          name: res.data.name,
          exam_problems: res.data.exam_problems,
        });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetExamProblems();
    };
  }, [UUID, setExamProblems, resetExamProblems]);

  if (error) return <div>에러가 발생했습니다.</div>;
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={100} />
      </div>
    );

  if (!currentExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section className="mx-auto my-10 max-w-[80rem] p-3">
      <div>문제집 이름 : {name}</div>

      <div className="rounded-lg bg-slate-200 p-3">
        <CurrentQuestion />

        <CurrentExamImage />

        <AdditionalView />

        {currentExamProblem.type === "obj" && <Candidates />}

        {currentExamProblem.type === "sub" && <SubjectiveAnswerTextarea />}
      </div>

      <NextOrPrevButtons />
    </section>
  );
}
