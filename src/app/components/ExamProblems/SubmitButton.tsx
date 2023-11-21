"use client";

import { Button } from "@nextui-org/react";
import { examProblemsAtom } from "@/jotai/examProblems";
import { useAtomValue } from "jotai";
import { useTransition } from "react";
import { evaluateProblems } from "@/action/action";
import { useState } from "react";
import { useEffect } from "react";

export default function SubmitButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);

  const examProblems = useAtomValue(examProblemsAtom);

  useEffect(() => {
    console.log(result);
  }, [result]);

  const onClick = () => {
    startTransition(async () => {
      const result = await evaluateProblems(examProblems.exam_problems);
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
