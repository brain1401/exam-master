"use client";

import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import { evaluateProblems } from "@/action/evaluateProblems";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamProblems from "@/hooks/useExamProblems";

export default function SubmitButton() {
  const [isPending, startTransition] = useTransition();
  const [uuid, setUuid] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const {
    examProblems: { exam_problems, name: problemSetName },
  } = useExamProblems();


  const router = useRouter();

  const onClick = () => {
    // server actions
    startTransition(async () => {
      try {
        const uuid = await evaluateProblems(exam_problems, problemSetName);
        setUuid(uuid);
        router.push(`/result/${uuid}`);
      } catch (e) {
        setError(e);
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
