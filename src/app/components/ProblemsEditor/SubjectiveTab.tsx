"use client";
import { useEffect } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import useProblems from "@/hooks/useProblems";
import ProblemEditorTabLayout from "../layouts/ProblemEditorTabLayout";

export default function SubjectiveTab() {
  const { currentProblem, setCurrentProblem, initCurrentProblem } =
    useProblems();

  const { question, subAnswer } = currentProblem ?? {};

  useEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  return (
    <ProblemEditorTabLayout>
      <div className="mb-4 flex flex-col">
        <Label className="mb-1 block text-[1.1rem]">문제</Label>
        <Textarea
          id="question"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={question}
          onChange={(e) => setCurrentProblem({ question: e.target.value })}
        />
      </div>
      <AddViewAndPhoto/>

      <div className="mt-4 mb-3 flex flex-col ">
        <Label className="mb-1 block text-[1.1rem]">답</Label>
        <Textarea
          id="answer"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={subAnswer ?? ""}
          onChange={(e) => setCurrentProblem({ subAnswer: e.target.value })}
        />
      </div>
    </ProblemEditorTabLayout>
  );
}
