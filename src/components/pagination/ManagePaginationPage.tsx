import { getServerSession } from "next-auth";
import LoginRequired from "@/components/ui/LoginRequired";
import ProblemSetsPage from "@/components/ProblemSets/ProblemSetsPage";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  getProblemSets,
  getProblemSetsByName,
  getProblemSetsMaxPage,
} from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";
import { defaultPageSize } from "@/const/pageSize";
export const metadata: Metadata = {
  title: "문제 풀기",
  description: "문제를 풀어보세요.",
};

type Props = {
  page: number;
  searchString?: string;
};

export default async function ManagePaginationPage({
  page,
  searchString,
}: Props) {
  const session = await getServerSession();
  if (!session || !session.user?.email) return <LoginRequired />;

  const userEmail = session.user.email;
  const userUUID = await getUserUUIDbyEmail(userEmail);
  const queryClient = new QueryClient();

  const [, maxPage] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        "problemSets",
        page,
        defaultPageSize,
        searchString ?? "",
        null,
        userEmail,
      ],
      queryFn: () =>
        searchString
          ? getProblemSetsByName(userEmail, searchString, page, defaultPageSize)
          : getProblemSets(userEmail, page, defaultPageSize),
    }),
    getProblemSetsMaxPage(searchString ?? "", defaultPageSize, userUUID),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProblemSetsPage
          page={page}
          searchString={searchString}
          type="manage"
          userEmail={userEmail}
          maxPage={maxPage || 1}
        />
    </HydrationBoundary>
  );
}
