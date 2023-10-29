"use client";

import { Problem, ProblemSetWithName } from "@/types/problems";
import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import ExamProblems from "@/app/components/ExamProblems";
type Props = {
  params: {
    UUID: string;
  };
};

export default function DetailedExamPage({ params: { UUID } }: Props) {
  const [problems, setProblems] = useState<ProblemSetWithName>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios
      .get(`/api/getExamProblemsByProblemSetUUID`, {
        params: {
          UUID,
        },
      })
      .then((res) => {
        setProblems({
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
  }, [UUID]);

  if (error) return <div>에러가 발생했습니다.</div>;
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={100} />
      </div>
    );

  return (
    <section className="mx-auto mt-10 max-w-[80rem] p-3">
      <div>DetailExamPage</div>
      {problems && <ExamProblems problems={problems} />}
    </section>
  );
}
