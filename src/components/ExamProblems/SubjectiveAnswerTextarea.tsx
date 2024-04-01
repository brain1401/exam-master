"use client";
import useExamProblems from "@/hooks/useExamProblems";
import { Textarea } from "../ui/textarea";
import { ExamProblem, ExamProblemAnswer } from "@/types/problems";

type Props = {
  currentExamProblem: ExamProblem;
};
export default function SubjectiveAnswerTextarea({ currentExamProblem }: Props) {
  const {
    currentExamProblemAnswer,
    setCurrentExamProblemAnswer,
  } = useExamProblems();

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = e.target.value;

    const updatedExamProblemAnswer: ExamProblemAnswer = {
      uuid: currentExamProblem.uuid,
      answer: newAnswer,
    };
    setCurrentExamProblemAnswer(updatedExamProblemAnswer);
  };

  return (
    <div>
      <Textarea
        className="resize-none"
        placeholder="답을 입력하세요."
        onChange={onTextAreaChange}
        value={
          currentExamProblemAnswer?.uuid === currentExamProblem.uuid &&
          typeof currentExamProblemAnswer.answer === "string"
            ? currentExamProblemAnswer.answer
            : ""
        }
      />
    </div>
  );
}
