"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { ExamResultsWithCountResponse } from "@/types/problems";
import CustomLoading from "../ui/CustomLoading";
import ResultsGrid from "./ResultsGrid";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "../ui/SearchBox";
import PaginationButton from "../ui/PaginationButton";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePagenationState from "@/hooks/usePagenationState";
import { fetchExamResults, getExamResultsMaxPage } from "@/service/problems";

export default function ResultsPage() {
  //화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const { resultsPage, resultsMaxPage, setResultsMaxPage, setResultsPage } =
    usePagenationState();

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();

  //화면 너비에 따라 pagination 사이즈 변경하기 위한 media query
  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const [pageSize, setPageSize] = useState(0);

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useQuery<ExamResultsWithCountResponse>({
    queryKey: [
      "results",
      isSearching,
      resultsPage,
      pageSize,
      debouncedSearchString,
      setResultsMaxPage,
    ],
    queryFn: () =>
      fetchExamResults(
        isSearching,
        debouncedSearchString,
        resultsPage,
        pageSize,
        setResultsMaxPage,
      ),
  });

  //페이지네이션 데이터 prefetch
  useEffect(() => {
    const prefetch = async () => {
      if (pageSize === 0) return;

      const fetchs: Promise<any>[] = [];

      let maxPage =
        (await getExamResultsMaxPage(
          isSearching,
          debouncedSearchString,
          pageSize,
        )) || 1;

      console.log("maxPage", maxPage);

      for (let i = 1; i <= maxPage; i++) {
        queryClient.prefetchQuery({
          queryKey: [
            "results",
            i,
            pageSize,
            isSearching,
            debouncedSearchString,
            setResultsMaxPage,
          ],
          queryFn: () =>
            fetchExamResults(
              isSearching,
              debouncedSearchString,
              i,
              pageSize,
              setResultsMaxPage,
            ),
        });
      }

      Promise.all(fetchs);
    };

    prefetch();
  }, [
    pageSize,
    isSearching,
    debouncedSearchString,
    setResultsMaxPage,
    queryClient,
  ]);

  // 화면 크기에 따라 페이지 사이즈 변경
  useLayoutEffect(() => {
    if (isXxs) {
      setPageSize(2);
      setResultsPage(1);
    } else if (isXs) {
      setPageSize(4);
      setResultsPage(1);
    } else if (isSm) {
      setPageSize(4);
      setResultsPage(1);
    } else if (isMd) {
      setPageSize(6);
      setResultsPage(1);
    } else if (isLg) {
      setPageSize(8);
      setResultsPage(1);
    } else if (isXl) {
      setPageSize(10);
      setResultsPage(1);
    }
  }, [isXxs, isXs, isSm, isMd, isLg, isXl, setResultsPage]);

  //검색 시 페이지 초기화
  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setResultsPage(1);
      setIsSearching(true);
    } else {
      setResultsPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString, setResultsPage]);

  //언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setResultsPage(1);
    };
  }, [setResultsPage]);

  const MainContent = () => {
    if (isLoading) {
      return <CustomLoading className="mt-10" />;
    } else if (results?.data.length === 0 && !isSearching) {
      return (
        <p className="mt-10 text-center text-xl font-semibold">
          아직 시험을 치루지 않았습니다!
        </p>
      );
    } else if (results?.data.length === 0 && isSearching) {
      return (
        <p className="mt-10 text-center text-xl font-semibold">
          검색 결과가 없습니다!
        </p>
      );
    } else {
      return <ResultsGrid results={results?.data} />;
    }
  };

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <section className="mx-auto mt-10 w-full max-w-[80rem] p-3">
        <h1 className="text-center text-3xl font-semibold">시험 기록</h1>
        <SearchBox
          className="mt-5"
          searchString={searchString}
          setSearchString={setSearchString}
        />
        <MainContent />
        <PaginationButton
          maxPage={resultsMaxPage}
          page={resultsPage}
          setPage={setResultsPage}
          className="mt-5 flex justify-center"
        />
      </section>
    </>
  );
}
