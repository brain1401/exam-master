"use client";

import { use, useEffect, useState } from "react";
import PaginationButton from "../ui/PaginationButton";
import useDebounce from "@/hooks/useDebounce";
import usePagenationState from "@/hooks/usePagenationState";
import ProblemSetsGrid from "./ProblemSetsGrid";
import usePrefetchPagination from "@/hooks/usePrefetchPagination";
import DynamicSearchBox from "../ui/DynamicSearchBox";
import useUiState from "@/hooks/useUiState";

type Props = {
  type: "manage" | "exam";
  userEmail: string;
  maxPage: number;
};

export default function ProblemSetsPage({ type, userEmail, maxPage }: Props) {
  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const { setProblemSetsPage, problemSetsMaxPage, problemSetsPage, pageSize } =
    usePagenationState();

  const { resetToDeletedUuid } = useUiState();

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  usePrefetchPagination(type, isSearching, debouncedSearchString, userEmail);

  // 검색 시 페이지 초기화
  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setProblemSetsPage(1);
      setIsSearching(true);
    } else {
      setProblemSetsPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString, setProblemSetsPage]);

  // 언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setProblemSetsPage(1);
    };
  }, [setProblemSetsPage]);

  // 언마운트 시 선택된 삭제할 문제집 초기화
  useEffect(() => {
    return () => {
      resetToDeletedUuid();
    };
  }, [resetToDeletedUuid]);

  useEffect(() => {
    console.log("pageSize : ", pageSize);
  }, [pageSize]);

  const title = type === "manage" ? "문제집 관리" : "풀 문제 선택";

  return (
    <section className="mx-auto w-full max-w-[70rem] p-3">
      <h1 className="mb-3 mt-10 text-center text-[2rem]">{title}</h1>

      <DynamicSearchBox
        searchString={searchString}
        setSearchString={setSearchString}
        type={type}
      />

      <ProblemSetsGrid
        debouncedSearchString={debouncedSearchString}
        isSearching={isSearching}
        pageSize={pageSize}
        type={type}
        userEmail={userEmail}
      />
      <PaginationButton
        page={problemSetsPage}
        setPage={setProblemSetsPage}
        maxPage={problemSetsMaxPage ?? maxPage}
        className="mt-5 flex justify-center pb-5"
      />
    </section>
  );
}
