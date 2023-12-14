import {
  fetchExamResults,
  fetchProblemSets,
  getExamResultsMaxPage,
  getProblemSetsMaxPage,
} from "@/service/problems";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagenationState from "./usePagenationState";

export default function usePrefetchPagination(
  type: "manage" | "exam" | "results",
  isSearching: boolean,
  debouncedSearchString: string,
) {
  const queryClient = useQueryClient();
  const { setProblemSetsMaxPage, setResultsMaxPage, pageSize } = usePagenationState();
  // 페이지네이션 데이터 prefetch
  useEffect(() => {
    const prefetch = async () => {
      if (pageSize === 0) return;

      const getMaxPage =
        type === "manage" || type === "exam"
          ? getProblemSetsMaxPage
          : getExamResultsMaxPage;
      const fetchData =
        type === "manage" || type === "exam"
          ? fetchProblemSets
          : fetchExamResults;
      const setMaxPage =
        type === "manage" || type === "exam"
          ? setProblemSetsMaxPage
          : setResultsMaxPage;

      const fetchs: Promise<any>[] = [];

      let maxPage =
        (await getMaxPage(isSearching, debouncedSearchString, pageSize)) || 1;

      console.log("maxPage", maxPage);

      for (let i = 1; i <= maxPage; i++) {
        fetchs.push(
          queryClient.prefetchQuery({
            queryKey: [
              "problemSets",
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

      Promise.all(fetchs);
    };

    prefetch();
  }, [
    pageSize,
    debouncedSearchString,
    queryClient,
    setProblemSetsMaxPage,
    setResultsMaxPage,
    isSearching,
    type,
  ]);

  return null;
}
