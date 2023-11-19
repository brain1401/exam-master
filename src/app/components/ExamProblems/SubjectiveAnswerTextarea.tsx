import { Textarea } from "@nextui-org/react";
import { currentExamProblemAtom } from "@/jotai/examProblems";
import { Problem } from "@/types/problems";
import { useAtom } from "jotai";

export default function SubjectiveAnswerTextarea() {
  const [currentExamProblem, setCurrentExamProblem] = useAtom(
    currentExamProblemAtom,
  );

  const onTextAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentExamProblems = { ...currentExamProblem };
    if (!newCurrentExamProblems) {
      throw new Error("무언가가 잘못되었습니다.");
    }
    newCurrentExamProblems.subAnswer = e.target.value;

    setCurrentExamProblem(newCurrentExamProblems as NonNullable<Problem>);
  };

  return (
    <div>
      <Textarea
        placeholder="답을 입력하세요."
        onChange={onTextAreaChange}
        value={currentExamProblem?.subAnswer ?? ""}
      />
    </div>
  );
}
