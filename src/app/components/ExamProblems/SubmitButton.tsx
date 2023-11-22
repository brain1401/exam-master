"use client";

import { Button } from "@nextui-org/react";
import { examProblemsAtom } from "@/jotai/examProblems";
import { useAtomValue } from "jotai";
import { useTransition } from "react";
import { evaluateProblems } from "@/action/evaluateProblems";
import { useState } from "react";
import { useEffect } from "react";

export default function SubmitButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);

  const { exam_problems } = useAtomValue(examProblemsAtom);

  useEffect(() => {
    console.log(result);
  }, [result]);

  const onClick = () => {
    // server actions 
    startTransition(async () => {
      const result = await evaluateProblems(exam_problems);
      setResult(result);
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
