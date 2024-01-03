"use client";

import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "../ui/SearchBox";
import PaginationButton from "../ui/PaginationButton";
import usePagenationState from "@/hooks/usePagenationState";
import ResultsGrid from "./ResultsGrid";
import useResponsivePageSize from "@/hooks/useResponsivePageSize";
import usePrefetchPagination from "@/hooks/usePrefetchPagination";
import DynamicSearchBox from "../ui/DynamicSearchBox";
import useUiState from "@/hooks/useUiState";

export default function ResultsPage() {
  //화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const { resultsPage, resultsMaxPage, pageSize, setResultsPage } =
    usePagenationState();

  const { resetToDeletedUuid } = useUiState();

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  // 화면 크기에 따라 페이지 사이즈 변경
  useResponsivePageSize("results");

  //모든 페이지네이션 list prefetch
  usePrefetchPagination("results", isSearching, debouncedSearchString);

  //검색 시 페이지 초기화
  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setResultsPage(1);
      setIsSearching(true);
    } else {
      setResultsPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString, setResultsPage, setIsSearching]);

  //언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setResultsPage(1);
    };
  }, [setResultsPage]);

  //언마운트 시 선택된 삭제할 문제집 초기화
  useEffect(() => {
    return () => {
      resetToDeletedUuid();
    };
  }, [resetToDeletedUuid]);

  return (
    <>
      <section className="mx-auto mt-10 w-full max-w-[80rem] p-3">
        <h1 className="mb-3 text-center text-3xl font-semibold">시험 기록</h1>

        <DynamicSearchBox
          searchString={searchString}
          setSearchString={setSearchString}
          type="result"
        />

        <ResultsGrid
          debouncedSearchString={debouncedSearchString}
          isSearching={isSearching}
          pageSize={pageSize}
        />

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
