"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import useExamProblems from "@/hooks/useExamProblems";
import { isProblemAsnwered } from "@/utils/problems";
import axios from "axios";
import { useState } from "react";

export default function SubmitButton() {

  const [isLoading, setIsLoading] = useState(false);

  const {
    examProblems: { problems, name: problemSetName },
  } = useExamProblems();

  const router = useRouter();

  const onClick = async() => {
    if (problems.some((problem) => !isProblemAsnwered(problem)))
      return alert("모든 문제에 답을 입력해주세요.");

      setIsLoading(true);
      try {
        const {data: {uuid}} = await axios.post("/api/evaluateProblems", {
          examProblems: problems,
          problemSetName,
        });

        router.push(`/result/${uuid}`);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
      }
      finally {
        setIsLoading(false);
      }
  };
  return (
    <>
      <Button className="mt-3" onClick={onClick} isLoading={isLoading}>
        {isLoading ? "채점중..." : "제출하기"}
      </Button>
    </>
  );
}
