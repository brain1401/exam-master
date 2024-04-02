"use client";
import useExamProblems from "@/hooks/useExamProblems";
import { Textarea } from "../ui/textarea";

export default function SubjectiveAnswerTextarea() {
  const { currentExamProblem, setCurrentExamProblem } = useExamProblems();

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = e.target.value;
    console.log(newAnswer);
    console.log(currentExamProblem);

    if (currentExamProblem) {
      setCurrentExamProblem({ subAnswer: newAnswer });
    }
  };

  return (
    <div>
      <Textarea
        className="resize-none"
        placeholder="답을 입력하세요."
        onChange={onTextAreaChange}
        value={currentExamProblem.subAnswer || ""}
      />
    </div>
  );
}
