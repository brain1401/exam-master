"use client";
import useExamProblems from "@/hooks/useExamProblems";
import { Button } from "../ui/button";
import useScrollEffect from "@/hooks/useScrollEffect";

type Props = {
  examProblemLength: number;
};
export default function ExamProblemsNextOrPrevButtons({
  examProblemLength,
}: Props) {
  const { currentExamProblemIndex, setCurrentExamProblemIndex } =
    useExamProblems();

  useScrollEffect([currentExamProblemIndex]);

  return (
    <div className="mt-2 flex gap-4">
      <Button
        className="w-[4.9rem] py-2"
        onClick={() => {
          if (currentExamProblemIndex > 0) {
            setCurrentExamProblemIndex(currentExamProblemIndex - 1);
          }
        }}
      >
        이전
      </Button>
      <Button
        className="w-[4.9rem] py-2"
        onClick={() => {
          if (currentExamProblemIndex < examProblemLength - 1) {
            setCurrentExamProblemIndex(currentExamProblemIndex + 1);
          }
        }}
      >
        다음
      </Button>
    </div>
  );
}
