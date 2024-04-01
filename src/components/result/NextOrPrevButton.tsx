"use client";
import useProblemResults from "@/hooks/useProblemResults";
import { Button } from "../ui/button";
import useScrollEffect from "@/hooks/useScrollEffect";

export default function NextOrPrevButton() {
  const {
    examProblemResultsIndex,
    setExamProblemResultsIndex,
    examProblemResults,
  } = useProblemResults();

  useScrollEffect([examProblemResultsIndex]);

  const onClickPrev = () => {
    if (examProblemResultsIndex > 0) {
      setExamProblemResultsIndex(examProblemResultsIndex - 1);
    }
  };

  const onClickNext = () => {
    if (examProblemResults.length - 1 > examProblemResultsIndex) {
      setExamProblemResultsIndex(examProblemResultsIndex + 1);
    }
  };

  return (
    <div className="mt-3 flex gap-x-3">
      <Button onClick={onClickPrev} className="px-6 py-2">이전</Button>
      <Button onClick={onClickNext} className="px-6 py-2">다음</Button>
    </div>
  );
}
