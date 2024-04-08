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
import JotaiProvider from "@/context/JotaiContext";

type Props = {
  page: number;
  searchString?: string;
};

export default async function PublicPaginationPage({
  page,
  searchString,
}: Props) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
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
    }),
    queryClient.prefetchQuery({
      queryKey: [
        "publicProblemSets",
        page || 1,
        defaultPageSize,
        searchString || "",
        null,
        "newest",
      ],
      queryFn: () =>
        searchString
          ? getPublicProblemSetsByName(
              searchString || "",
              page || 1,
              defaultPageSize,
              "newest",
            )
          : getPublicProblemSets(page ?? 1, defaultPageSize, "newest"),
    }),
  ]);

  const maxPage = await getPublicProblemSetsMaxPage(
    searchString ?? "",
    defaultPageSize,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JotaiProvider>
        <PublicProblemsPage
          maxPage={maxPage}
          page={page}
          searchString={searchString}
        />
      </JotaiProvider>
    </HydrationBoundary>
  );
}
