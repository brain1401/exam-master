"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { ExamResultsWithCountResponse } from "@/types/problems";
import CustomLoading from "../ui/CustomLoading";
import ResultsGrid from "./ResultsGrid";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "../ui/SearchBox";
import PaginationButton from "../ui/PaginationButton";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";
import getPageSizeByObj from "@/utils/getPageSizeByObj";
import { useQuery } from "@tanstack/react-query";

export default function ResultsPage() {
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const [pageSize, setPageSize] = useState(
    getPageSizeByObj({ isXxs, isXs, isSm, isMd, isLg, isXl }),
  );

  useLayoutEffect(() => {
    if (isXxs) {
      setPageSize(2);
      setPage(1);
    } else if (isXs) {
      setPageSize(4);
      setPage(1);
    } else if (isSm) {
      setPageSize(4);
      setPage(1);
    } else if (isMd) {
      setPageSize(6);
      setPage(1);
    } else if (isLg) {
      setPageSize(8);
      setPage(1);
    } else if (isXl) {
      setPageSize(10);
      setPage(1);
    }
  }, [isXxs, isXs, isSm, isMd, isLg, isXl]);

  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setPage(1);
      setIsSearching(true);
    } else {
      setPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString]);

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useQuery<ExamResultsWithCountResponse>({
    queryKey: ["results", isSearching, page, pageSize, debouncedSearchString],
    queryFn: async () => {
      let res;
      if (isSearching) {
        if (debouncedSearchString.trim().length === 0) return;
        if (pageSize === 0) return;
        res = await axios.get("/api/getExamResultsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page,
            pageSize,
          },
        });
      } else {
        if (debouncedSearchString.trim().length > 0) return;
        if (pageSize === 0) return;
        res = await axios.get("/api/getExamResults", {
          params: {
            page,
            pageSize,
          },
        });
      }
      const data = res.data;
      setMaxPage(data.meta.pagination.pageCount || 1);
      return res.data;
    },
  });

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
          maxPage={maxPage}
          page={page}
          setPage={setPage}
          className="mt-5 flex justify-center"
        />
      </section>
    </>
  );
}
