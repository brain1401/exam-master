import useProblemResults from "@/hooks/useProblemResults";

export default function CurrentProblemIndicator() {
  const { examProblemResultsIndex, examProblemResults: {length} } = useProblemResults();
  return (
    <h3 className="text-xl font-semibold mb-3">
      {`${examProblemResultsIndex + 1}번 문제 / 총${length}문제`}
    </h3>
  )
}
