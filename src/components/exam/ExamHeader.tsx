import { Button } from "../ui/button";

type Props = {
  totalProblems: number;
  currentExamProblemIndex: number;
  setCurrentExamProblemIndex: (index: number) => void;
};

export default function ExamHeader({
  currentExamProblemIndex,
  setCurrentExamProblemIndex,
  totalProblems,
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

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[1.2rem] font-bold md:text-2xl">
        {`총 문제 수 ${totalProblems}`}
      </h2>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handlePrevQuestion}>
          이전
        </Button>
        <Button onClick={handleNextQuestion}>다음</Button>
      </div>
    </div>
  );
}
