import { handleEnterKeyPress } from "@/utils/keyboard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Candidate, ExamProblem } from "@/types/problems";
import { useEffect, useState } from "react";

type Props = {
  setIsExamStarted: (isStarted: boolean) => void;
  setCurrentExamProblemIndex: (index: number) => void;
  setCurrentPublicExamProblemCandidates: (
    candidates: Candidate[] | null,
  ) => void;
  currentExamProblemIndex: number;
  publicExamProblems: ExamProblem[];
};

export default function ExamFooter({
  publicExamProblems,
  setCurrentExamProblemIndex,
  setCurrentPublicExamProblemCandidates,
  currentExamProblemIndex,
  setIsExamStarted,
}: Props) {
  const [value, setValue] = useState("1");

  useEffect(() => {
    setValue((currentExamProblemIndex + 1).toString());
  }, [currentExamProblemIndex]); 

  const handleEndExam = () => {
    setIsExamStarted(false);
    setCurrentExamProblemIndex(0);
    setCurrentPublicExamProblemCandidates(null);
  };

  const handleChangeQuestion = () => {
    const newIndex = parseInt(value, 10) - 1;
    if (newIndex >= 0 && newIndex < publicExamProblems.length) {
      setCurrentExamProblemIndex(newIndex);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between">
      <Button variant="outline" onClick={handleEndExam}>
        시험 종료
      </Button>
      <div className="flex items-center gap-4">
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
    </div>
  );
}
