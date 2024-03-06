import useExamProblems from "@/hooks/useExamProblems";

export default function CurrentProblemIndicator() {
  const {
    examProblems: {
      problems: { length },
    },
    currentExamProblemIndex,
  } = useExamProblems();
  return (
    <div className="text-xl font-semibold">
      <p>{`현재 문제 : ${currentExamProblemIndex + 1}문제/${length}문제`}</p>
    </div>
  );
}
