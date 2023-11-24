"use client";
import useExamProblemResults from "@/hooks/useExamProblemResults";
import { Button } from "@nextui-org/react";

export default function NextOrPrevButton() {
  const {
    examProblemResultsIndex,
    setExamProblemResultsIndex,
    examProblemResults,
  } = useExamProblemResults();

  
  const onClickPrev = () => {
    if (examProblemResultsIndex > 0)
      setExamProblemResultsIndex(examProblemResultsIndex - 1);
  };

  const onClickNext = () => {
    if (examProblemResults.length - 1 > examProblemResultsIndex)
      setExamProblemResultsIndex(examProblemResultsIndex + 1);
  };

  return (
    <div className="mt-3 flex gap-x-3">
      <Button onClick={onClickPrev}>이전</Button>
      <Button onClick={onClickNext}>다음</Button>
    </div>
  );
}
