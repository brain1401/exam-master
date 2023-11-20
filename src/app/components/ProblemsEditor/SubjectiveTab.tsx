"use client";
import { useEffect } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import {
  currentProblemAtom,
  initCurrentProblemAtom,
} from "../../../jotai/problems";
import { useAtom, useSetAtom } from "jotai";
import { Textarea } from "@nextui-org/react";

export default function SubjectiveTab() {
  const [currentProblem, setCurrentProblem] = useAtom(currentProblemAtom);
  const initCurrentProblem = useSetAtom(initCurrentProblemAtom);

  const { question, subAnswer } = currentProblem ?? {};

  useEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  return (
    <form
      className="flex flex-col rounded-xl bg-gray-100 p-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="mb-4 flex flex-col">
        <Textarea
          id="question"
          classNames={{
            inputWrapper: "w-full !h-[6rem] border-nextUiBorder",
            input: "text-[1rem]",
            label: "text-md font-semibold text-lg",
          }}
          variant="bordered"
          maxRows={3}
          label="문제"
          labelPlacement="outside"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={question}
          onChange={(e) => setCurrentProblem({ question: e.target.value })}
        />
      </div>
      <AddViewAndPhoto className="mb-4" />

      <div className="mb-3 flex flex-col">
        <Textarea
          id="answer"
          classNames={{
            inputWrapper: "w-full !h-[6rem] border-nextUiBorder",
            input: "text-[1rem]",
            label: "text-md font-semibold text-lg",
          }}
          maxRows={3}
          label="답"
          labelPlacement="outside"
          variant="bordered"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={subAnswer ?? ""}
          onChange={(e) => setCurrentProblem({ subAnswer: e.target.value })}
        />
      </div>
    </form>
  );
}
