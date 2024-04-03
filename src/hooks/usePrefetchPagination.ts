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
  getFetchMaxPageFunction,
  getSetMaxPageFunction,
} from "@/utils/pagination";
import { getQueryKey } from "@/utils/problems";

export default function usePrefetchPagination(
  type: PrefetchPaginationType,
  debouncedSearchString: string,
  useremail: string | null,
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

      const getMaxPage = getFetchMaxPageFunction(type);
      const fetchData = getFetchDataFunction(type);
      const setMaxPage = getSetMaxPageFunction({
        type,
        setProblemSetsMaxPage,
        setResultsMaxPage,
        setPublicProblemSetsMaxPage,
      });
      const queryKey = getQueryKey(type);

      const fetchs: Promise<any>[] = [];

      let maxPage =
        (await getMaxPage(debouncedSearchString, pageSize)) || 1;

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
              debouncedSearchString,
              setMaxPage,
              useremail,
            ],
            queryFn: () =>
              fetchData(debouncedSearchString, i, pageSize, setMaxPage),
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
    useremail,
    type,
  ]);

  return null;
}
