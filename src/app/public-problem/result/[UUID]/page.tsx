import ResultPage from "@/components/result/ResultPage";
import ProblemNotFound from "@/components/ui/ProblemNotFound";
import JotaiProvider from "@/context/JotaiContext";
import {
  checkIfPublicExamResultExists,
  getPublicExamProblemResult,
} from "@/service/problems";
import { isValidUUID } from "@/utils/problems";

type Props = {
  params: Promise<{
    UUID: string;
  }>;
};

export default async function PublicProblemResult(props: Props) {
  const params = await props.params;

  const {
    UUID
  } = params;

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
