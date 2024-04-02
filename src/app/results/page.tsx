import { getServerSession } from "next-auth";
import LoginRequired from "@/components/ui/LoginRequired";
import ResultsPage from "@/components/results/ResultsPage";
import { Metadata } from "next";
import { getExamResults, getResultsMaxPage } from "@/service/problems";
import { defaultPageSize } from "@/const/pageSize";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "시험 결과",
  description: "결과를 확인하세요.",
};

export default async function Results() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }

  const userEmail = session.user.email;

  const maxPage = await getResultsMaxPage(userEmail, defaultPageSize);

  const queryClient = new QueryClient();

  // 서버에서 prefetch
  await queryClient.prefetchQuery({
    queryKey: ["results", 1, defaultPageSize, false, "", null, userEmail],
    queryFn: () => getExamResults(userEmail, "1", defaultPageSize.toString()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultsPage userEmail={userEmail} maxPage={maxPage} />
    </HydrationBoundary>
  );
}
