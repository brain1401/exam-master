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


export default function ResultsPage() {
  const [results, setResults] = useState<
    ExamResultsWithCountResponse | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string } | null>(null);

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

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isSearching) {
        if (debouncedSearchString.trim().length === 0) return;
        try {
          if (pageSize === 0) return;
          const res = await axios.get("/api/getExamResultsByName", {
            params: {
              name: debouncedSearchString.trim(),
              page,
              pageSize,
            },
          });
          setMaxPage(res.data.meta.pagination.pageCount || 1);
          setResults(res.data);
        } catch (e) {
          if (isAxiosError(e)) {
            setError(e.response?.data.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        try {
          if (debouncedSearchString.trim().length > 0) return;
          if (pageSize === 0) return;
          const res = await axios.get("/api/getExamResults", {
            params: {
              page,
              pageSize,
            },
          });
          setResults(res.data);
          setMaxPage(res.data.meta.pagination.pageCount || 1);
        } catch (e) {
          if (isAxiosError(e)) {
            setError(e.response?.data.message);
          }
        } finally {
          pageSize !== 0 && setLoading(false);
        }
      }
    };
    fetchData();
  }, [page, isSearching, debouncedSearchString, pageSize]);

  const MainContent = () => {
    if (loading) {
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

  if (error) {
    return <div>{error.error}</div>;
  }

  return (
    <>
      <section className="mx-auto mt-10 max-w-[80rem] p-3">
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
