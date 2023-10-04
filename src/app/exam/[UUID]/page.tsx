"use client";

import { Problem, ProblemSetWithName } from "@/types/problems";
import { useEffect, useState } from "react";
import axios from "axios";
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
      .get(`/api/getProblemsByUUID`, {
        params: {
          UUID,
        },
      })
      .then((res) => {
        console.log(res.data)
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

  useEffect(() => {
    console.log(problems);
  }, [problems]);

  if (error) return <div>에러가 발생했습니다.</div>;
  if (loading) return <div>로딩중...</div>;

  return (
    <section>
      <div>DetailExamPage</div>
      <ul>
        {problems?.exam_problems && problems?.exam_problems.map((problem: Problem) => 
          (
            <li key={problem?.id}>
              <div>{problem?.question}</div>
            </li>
          
          ))}

      </ul>
    </section>
  );
}
