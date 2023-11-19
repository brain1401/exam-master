"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import ExamProblems from "@/app/components/ExamProblems/ExamProblems";
import {
  examProblemsAtom,
  resetExamProblemsAtom,
} from "@/jotai/examProblems";
import { useAtom, useSetAtom } from "jotai";

type Props = {
  params: {
    UUID: string;
  };
};

export default function DetailedExamPage({ params: { UUID } }: Props) {
  const [examProblems, setExamProblems] = useAtom(examProblemsAtom);
  const resetExamProblems = useSetAtom(resetExamProblemsAtom);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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

  return (
    <section className="mx-auto my-10 max-w-[80rem] p-3">
      {examProblems && <ExamProblems />}
    </section>
  );
}
