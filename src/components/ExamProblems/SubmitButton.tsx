"use client";
import { Button } from "../ui/button";
import useExamProblems from "@/hooks/useExamProblems";
import axios from "axios";
import { useState } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { isExamProblemAnswered } from "@/utils/problems";

export default function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { revalidateAllPathAndRedirect } = useRevalidation();

  const { examProblems, examProblemSetName } = useExamProblems();

  const onClick = async () => {
    if (!examProblems.every(isExamProblemAnswered)) {
      return alert("모든 문제에 답을 입력해주세요.");
    }

    setIsLoading(true);
    let uuid = "";

    try {
      const { data } = await axios.post("/api/evaluateExamProblems", {
        examProblems,
        examProblemSetName,
      });
      uuid = data.uuid;

      // // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화 및 결과 페이지로 리다이렉트
      await revalidateAllPathAndRedirect(`/result/${uuid}`);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
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
