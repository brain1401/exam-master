"use client";
import { Textarea } from "@nextui-org/react";;
import { ExamProblem } from "@/types/problems";
import useExamProblems from "@/hooks/useExamProblems";

export default function SubjectiveAnswerTextarea() {

  const { currentExamProblem, setCurrentExamProblem } = useExamProblems();

  const onTextAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentExamProblems = { ...currentExamProblem };

    if (!newCurrentExamProblems) {
      throw new Error("문제가 없습니다.");
    }
    newCurrentExamProblems.subAnswer = e.target.value;

    setCurrentExamProblem(newCurrentExamProblems as NonNullable<ExamProblem>);
  };

  return (
    <div>
      <Textarea
        classNames={{
          inputWrapper: "bg-nextUiBorder"
        }}
        radius="sm"
        placeholder="답을 입력하세요."
        onChange={onTextAreaChange}
        value={currentExamProblem.subAnswer ?? ""}
      />
    </div>
  );
}
