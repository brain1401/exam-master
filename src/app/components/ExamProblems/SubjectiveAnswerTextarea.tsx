"use client";
import { Textarea } from "../ui/textarea";
import { ExamProblem } from "@/types/problems";
import useExamProblems from "@/hooks/useExamProblems";

export default function SubjectiveAnswerTextarea() {
  const { currentExamProblem, setCurrentExamProblem } = useExamProblems();

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        className="resize-none"
        placeholder="답을 입력하세요."
        onChange={onTextAreaChange}
        value={currentExamProblem.subAnswer ?? ""}
      />
    </div>
  );
}
