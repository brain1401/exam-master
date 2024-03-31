"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import useExamProblems from "@/hooks/useExamProblems";
import { isExamProblemAnswersAnswered } from "@/utils/problems";
import axios from "axios";
import { useState } from "react";
import { ExamProblem, ExamProblemSet } from "@/types/problems";
import useRevalidate from "@/hooks/useRevalidate";

type Props = {
  examProblemSet: ExamProblemSet;
  examProblems: ExamProblem[];
};

export default function SubmitButton({ examProblemSet, examProblems }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { revalidateAllPath } = useRevalidate();
  const router = useRouter();

  const { examProblemAnswers, setExamProblemAnswers } = useExamProblems();

  const onClick = async () => {
    if (
      !isExamProblemAnswersAnswered(
        examProblemAnswers,
        examProblemSet.problems.length,
      )
    ) {
      return alert("모든 문제에 답을 입력해주세요.");
    }

    setIsLoading(true);
    let uuid = "";

    try {
      const { data } = await axios.post("/api/evaluateProblems", {
        examProblemAnswers,
        examProblems,
        problemSetName: examProblemSet.name,
      });
      uuid = data.uuid;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
      // 서버 컴포넌트 캐시 무효화
      revalidateAllPath();
      setExamProblemAnswers([]); // 제출 후 답안 초기화
      router.push(`/result/${uuid}`);
    }
  };

  return (
    <>
      <Button
        className="mt-3 w-[6.5rem] px-6"
        onClick={onClick}
        isLoading={isLoading}
      >
        {isLoading ? "채점중..." : "제출하기"}
      </Button>
    </>
  );
}
