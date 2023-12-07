"use client";

import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import { evaluateProblems } from "@/action/evaluateProblems";
import { useRouter } from "next/navigation";
import useExamProblems from "@/hooks/useExamProblems";
import { isProblemAsnwered } from "@/service/problems";

export default function SubmitButton() {
  const [isPending, startTransition] = useTransition();

  const {
    examProblems: { exam_problems, name: problemSetName },
  } = useExamProblems();

  const router = useRouter();

  const onClick = () => {
    // server actions
    startTransition(async () => {
      try {
        if (exam_problems.some((problem) => !isProblemAsnwered(problem)))
          return alert("모든 문제에 답을 입력해주세요.");
        const uuid = await evaluateProblems(exam_problems, problemSetName);
        router.push(`/result/${uuid}`);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
      }
    });
  };
  return (
    <>
      <Button className="mt-3" onClick={onClick} isLoading={isPending}>
        {isPending ? "채점중..." : "제출하기"}
      </Button>
    </>
  );
}
