import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagenationState from "./usePagenationState";
import {
  PrefetchPaginationType,
  ProblemSetWithPagination,
  PublicProblemSetWithPagination,
  ResultsWithPagination,
} from "@/types/problems";
import {
  getFetchDataFunction,
  getGetMaxPageFunction,
  getSetMaxPageFunction,
} from "@/utils/pagination";

export default function usePrefetchPagination(
  type: PrefetchPaginationType,
  isSearching: boolean,
  debouncedSearchString: string,
) {
  const queryClient = useQueryClient();
  const {
    setProblemSetsMaxPage,
    setResultsMaxPage,
    setPublicProblemSetsMaxPage,
    pageSize,
  } = usePagenationState();
  // 페이지네이션 데이터 prefetch
  useEffect(() => {
    const prefetch = async () => {
      if (pageSize === 0) return;

      const getMaxPage = getGetMaxPageFunction(type);
      const fetchData = getFetchDataFunction(type);
      const setMaxPage = getSetMaxPageFunction({
        type,
        setProblemSetsMaxPage,
        setResultsMaxPage,
        setPublicProblemSetsMaxPage,
      });
      const queryKey =
        type === "manage" || type === "exam" ? "problemSets" : "results";

      const fetchs: Promise<any>[] = [];

      let maxPage =
        (await getMaxPage(isSearching, debouncedSearchString, pageSize)) || 1;

      console.log("maxPage", maxPage);

      for (let i = 1; i <= maxPage; i++) {
        fetchs.push(
          queryClient.prefetchQuery<
            | ProblemSetWithPagination
            | PublicProblemSetWithPagination
            | ResultsWithPagination
            | null
          >({
            queryKey: [
              queryKey,
              i,
              pageSize,
              isSearching,
              debouncedSearchString,
              setMaxPage,
            ],
            queryFn: () =>
              fetchData(
                isSearching,
                debouncedSearchString,
                i,
                pageSize,
                setMaxPage,
              ),
          }),
        );
      }

      await Promise.all(fetchs);
    };

    prefetch();
  }, [
    pageSize,
    debouncedSearchString,
    queryClient,
    setPublicProblemSetsMaxPage,
    setProblemSetsMaxPage,
    setResultsMaxPage,
    isSearching,
    type,
  ]);

  return null;
}
