"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { ExamResultsWithCountResponse } from "@/types/problems";
import CustomLoading from "../ui/CustomLoading";
import ResultsGrid from "./ResultsGrid";
import useDebounce from "@/hooks/debounce";
import SearchBox from "../ui/SearchBox";
import PaginationButton from "../ui/PaginationButton";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";
export default function ResultsPage() {
  const [results, setResults] = useState<
    ExamResultsWithCountResponse | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string } | null>(null);

  const { isXxs, isXs, isSm, isMd, isLg, isXl } = useCustomMediaQuery();

  useEffect(() => {
    if (isXxs) setPageSize(2);
    else if (isXs) setPageSize(4);
    else if (isSm) setPageSize(4);
    else if (isMd) setPageSize(6);
    else if (isLg) setPageSize(8);
    else if (isXl) setPageSize(10);
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
    const fetchData = async () => {
      setLoading(true);
      if (isSearching) {
        if (debouncedSearchString.trim().length === 0) return;
        try {
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
          const res = await axios.get("/api/getExamResults", {
            params: {
              page,
              pageSize,
            },
          });
          setResults(res.data);
          setMaxPage(res.data.meta.pagination.pageCount || 1);
          console.log(res.data);
        } catch (e) {
          if (isAxiosError(e)) {
            setError(e.response?.data.message);
          }
        } finally {
          setLoading(false);
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
