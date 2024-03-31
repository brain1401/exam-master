import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MainPage from "./components/MainPage/MainPage";
import { getPublicProblemSets, getPublicProblemSetsMaxPage } from "@/service/problems";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["publicProblemSets", 1, 8, false, "", null, null],
    queryFn: () => getPublicProblemSets("1", "8"),
  });

  const maxPage = await getPublicProblemSetsMaxPage(false, "", 8);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainPage maxPage={maxPage}/>
    </HydrationBoundary>
  );
}
