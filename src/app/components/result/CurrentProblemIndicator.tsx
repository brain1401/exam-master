import useExamProblemResults from "@/hooks/useExamProblemResults";

export default function CurrentProblemIndicator() {
  const { examProblemResultsIndex, examProblemResults } = useExamProblemResults();
  return (
    <h3 className="text-xl font-semibold">
      {examProblemResultsIndex + 1} / {examProblemResults.length}
    </h3>
  )
}
