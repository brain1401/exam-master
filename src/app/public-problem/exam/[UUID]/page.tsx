import PublicProblemExamPage from "@/components/publicProblem/PublicProblemExamPage";
import ProblemSetNotFound from "@/components/ui/ProblemSetNotFound";
import JotaiProvider from "@/context/JotaiContext";
import { getPublicProblemSetByUUID } from "@/service/problems";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function PublicProblemExam({ params: { UUID } }: Props) {
  const publicProblemSet = await getPublicProblemSetByUUID(UUID);

  if (!publicProblemSet) {
    return <ProblemSetNotFound />;
  }
  return (
    <JotaiProvider storeType="publicProblem">
      <PublicProblemExamPage publicProblemSet={publicProblemSet} />
    </JotaiProvider>
  );
}
