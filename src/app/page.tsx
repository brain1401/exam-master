import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MainPage from "@/components/MainPage/MainPage";
import {
  getPublicProblemSets,
  getPublicProblemSetsMaxPage,
} from "@/service/problems";
import { defaultPageSize } from "@/const/pageSize";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["publicProblemSets", 1, defaultPageSize, false, "", null, null],
    queryFn: () => getPublicProblemSets("1", defaultPageSize.toString()),
  });

  const maxPage = await getPublicProblemSetsMaxPage(false, "", defaultPageSize);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainPage maxPage={maxPage} />
    </HydrationBoundary>
  );
}
