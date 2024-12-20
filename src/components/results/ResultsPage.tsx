"use client";

import { useEffect, useState } from "react";
import PaginationButton from "../ui/PaginationButton";
import usePagenationState from "@/hooks/usePagenationState";
import ResultsGrid from "./ResultsGrid";
import DynamicSearchBox from "../ui/DynamicSearchBox";
import { useHydrateAtoms } from "jotai/utils";
import {
  resultMaxPageAtom,
  resultPageAtom,
  userEmailAtom,
} from "@/jotai/pagination";
import useRevalidation from "@/hooks/useRevalidate";
import { useQuery } from "@tanstack/react-query";
import { ResultsWithPagination } from "@/types/problems";
import { fetchExamResults } from "@/utils/problems";

type Props = {
  userEmail: string;
  maxPage: number;
  page: number;
  searchString?: string;
};

export default function ResultsPage({
  userEmail,
  maxPage,
  page,
  searchString,
}: Props) {
  useHydrateAtoms([
    [resultPageAtom, page],
    [resultMaxPageAtom, maxPage],
    [userEmailAtom, userEmail],
  ]);

  //화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const {
    resultPage,
    pageSize,
    setUserEmail,
    setResultsPage,
    setResultsMaxPage,
  } = usePagenationState();

  const { data: results } = useQuery<ResultsWithPagination | null>({
    queryKey: [
      "results",
      resultPage,
      pageSize,
      searchString ?? "",
      setResultsMaxPage,
      userEmail,
    ],
    queryFn: () =>
      searchString
        ? fetchExamResults(
            searchString,
            resultPage,
            pageSize,
            setResultsMaxPage,
          )
        : fetchExamResults("", resultPage, pageSize, setResultsMaxPage),
  });

  useEffect(() => {
    setResultsPage(page);
  }, [page, setResultsPage]);

  useEffect(() => {
    setResultsMaxPage(maxPage);
  }, [maxPage, setResultsMaxPage]);

  useEffect(() => {
    setUserEmail(userEmail);
  }, [userEmail, setUserEmail]);

  const { revalidateAllPath } = useRevalidation();

  const [localSearchString, setLocalSearchString] = useState(
    searchString ?? "",
  );
  const [latestSearchString] = useState(localSearchString);

  // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
  useEffect(() => {
    revalidateAllPath();
  }, [revalidateAllPath]);

  //언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setResultsPage(1);
    };
  }, [setResultsPage]);

  return (
    <>
      <section className="mx-auto mt-10 w-full max-w-[70rem] p-3">
        <h1 className="mb-3 text-center text-3xl font-semibold">시험 기록</h1>

        <DynamicSearchBox
          searchString={localSearchString}
          setSearchString={setLocalSearchString}
          type="results"
        />

        <ResultsGrid
          searchString={latestSearchString}
          pageSize={pageSize}
          userEmail={userEmail}
        />

        <PaginationButton
          page={results?.pagination.page || 1}
          maxPage={results?.pagination.pageCount || 1}
          searchString={searchString ?? ""}
          type="results"
          className="mt-10 flex justify-center pb-5"
        />
      </section>
    </>
  );
}
