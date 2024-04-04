import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PublicProblemsPage from "@/components/MainPage/PublicProblemsPage";
import {
  getPublicProblemSets,
  getPublicProblemSetsByName,
  getPublicProblemSetsMaxPage,
} from "@/service/problems";
import { defaultPageSize } from "@/const/pageSize";

type Props = {
  page: number;
  searchString?: string;
};

export default async function PublicPaginationPage({
  page,
  searchString,
}: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "publicProblemSets",
      page || 1,
      defaultPageSize,
      searchString || "",
      null,
      "popular",
    ],
    queryFn: () =>
      searchString
        ? getPublicProblemSetsByName(
            searchString || "",
            page || 1,
            defaultPageSize,
            "popular",
          )
        : getPublicProblemSets(page ?? 1, defaultPageSize, "popular"),
  });

  const maxPage = await getPublicProblemSetsMaxPage(
    searchString ?? "",
    defaultPageSize,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicProblemsPage
        maxPage={maxPage || 1}
        page={page || 1}
        searchString={searchString}
      />
    </HydrationBoundary>
  );
}
