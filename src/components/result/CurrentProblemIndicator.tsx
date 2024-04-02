import useProblemResults from "@/hooks/useProblemResults";

export default function CurrentProblemIndicator() {
  const {
    currentExamResultIndex: examProblemResultsIndex,
    examResults: { length },
  } = useProblemResults();
  return (
    <h3 className="mb-3 text-xl font-semibold">
      {`${examProblemResultsIndex + 1}번 문제 / 총${length}문제`}
    </h3>
  );
}
