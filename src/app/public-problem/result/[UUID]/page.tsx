import ResultPage from "@/components/result/ResultPage";
import ProblemNotFound from "@/components/ui/ProblemNotFound";
import JotaiProvider from "@/context/JotaiContext";
import {
  checkIfPublicExamResultExists,
  getPublicExamProblemResult,
} from "@/service/problems";
import { isValidUUID } from "@/utils/problems";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function PublicProblemResult({ params: { UUID } }: Props) {
  if (
    !UUID ||
    !isValidUUID(UUID) ||
    !(await checkIfPublicExamResultExists(UUID))
  ) {
    return <ProblemNotFound />;
  }

  const examResult = await getPublicExamProblemResult(UUID);

  if (!examResult) {
    return <ProblemNotFound />;
  }
  return (
    <JotaiProvider>
      <ResultPage _examResultsSet={examResult} />
    </JotaiProvider>
  );
}
