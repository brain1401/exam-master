import { getServerSession } from "next-auth";
import LoginRequired from "@/components/ui/LoginRequired";
import ResultsPage from "@/components/results/ResultsPage";
import { Metadata } from "next";
import {
  getExamResults,
  getExamResultsByName,
  getResultsMaxPage,
} from "@/service/problems";
import { defaultPageSize } from "@/const/pageSize";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  page: number;
  searchString?: string;
};

export default async function ResultsPaginationPage({
  page,
  searchString,
}: Props) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }

  const userEmail = session.user.email;

  const maxPage = await getResultsMaxPage(
    userEmail,
    defaultPageSize,
    searchString ?? "",
  );

  const queryClient = new QueryClient();

  // 서버에서 prefetch
  await queryClient.prefetchQuery({
    queryKey: [
      "results",
      page,
      defaultPageSize,
      searchString ?? "",
      null,
      userEmail,
    ],
    queryFn: () =>
      searchString
        ? getExamResultsByName(userEmail, searchString, page, defaultPageSize)
        : getExamResults(userEmail, page, defaultPageSize),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultsPage
        page={page}
        searchString={searchString}
        userEmail={userEmail}
        maxPage={maxPage}
      />
    </HydrationBoundary>
  );
}
