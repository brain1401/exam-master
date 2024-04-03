"use client";

import { useEffect, useState } from "react";
import PaginationButton from "../ui/PaginationButton";
import usePagenationState from "@/hooks/usePagenationState";
import ResultsGrid from "./ResultsGrid";
import DynamicSearchBox from "../ui/DynamicSearchBox";
import { useHydrateAtoms } from "jotai/utils";
import { resultMaxPageAtom, resultPageAtom } from "@/jotai/pagination";
import useRevalidation from "@/hooks/useRevalidate";

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
  ]);

  //화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const { resultPage, resultMaxPage, pageSize, setResultsPage } =
    usePagenationState();

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
          maxPage={maxPage}
          page={resultPage}
          searchString={searchString}
          type="results"
          className="mt-10 flex justify-center pb-5"
        />
      </section>
    </>
  );
}
