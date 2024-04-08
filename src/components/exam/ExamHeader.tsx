import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { handleEnterKeyPress } from "@/utils/keyboard";

type Props = {
  totalProblems: number;
  currentExamProblemIndex: number;
  setCurrentExamProblemIndex: (index: number) => void;
  publicExamProblemLength: number;
};

export default function ExamHeader({
  currentExamProblemIndex,
  setCurrentExamProblemIndex,
  totalProblems,
  publicExamProblemLength,
}: Props) {
  const handlePrevQuestion = () => {
    if (currentExamProblemIndex > 0) {
      setCurrentExamProblemIndex(currentExamProblemIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentExamProblemIndex < totalProblems - 1) {
      setCurrentExamProblemIndex(currentExamProblemIndex + 1);
    }
  };
  const [value, setValue] = useState("1");

  useEffect(() => {
    setValue((currentExamProblemIndex + 1).toString());
  }, [currentExamProblemIndex]);

  const handleChangeQuestion = () => {
    const newIndex = parseInt(value, 10) - 1;
    if (newIndex >= 0 && newIndex < publicExamProblemLength) {
      setCurrentExamProblemIndex(newIndex);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4">
        <Label>문제 이동</Label>
        <Input
          value={value}
          inputClassName="w-[3rem] text-center px-0"
          onChange={(e) => setValue(e.target.value)}
          allowOnlyNumber
          onKeyDown={(e) =>
            handleEnterKeyPress(e, () => handleChangeQuestion())
          }
        />
        <Button onClick={handleChangeQuestion}>이동</Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handlePrevQuestion}>
          이전
        </Button>
        <Button onClick={handleNextQuestion}>다음</Button>
      </div>
    </div>
  );
}
