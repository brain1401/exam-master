"use client";

import { Suspense, useEffect, useState } from "react";
import PaginationButton from "../ui/PaginationButton";
import SearchBox from "../ui/SearchBox";
import useDebounce from "@/hooks/useDebounce";
import usePagenationState from "@/hooks/usePagenationState";;
import ProblemSetsGrid from "./ProblemSetsGrid";
import CustomLoading from "../ui/CustomLoading";
import useResponsivePageSize from "@/hooks/useResponsivePageSize";
import usePrefetchPagination from "@/hooks/usePrefetchPagination";

type Props = {
  type: "manage" | "exam";
};

export default function ProblemSetsPage({ type }: Props) {
  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const {
    setProblemSetsPage,
    problemSetsMaxPage,
    problemSetsPage,
    pageSize,
  } = usePagenationState();

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);


  //모든 페이지네이션 list prefetch
  usePrefetchPagination(pageSize, type, isSearching, debouncedSearchString);

  // 화면 크기에 따라 페이지 사이즈 변경
  useResponsivePageSize("problemSets");

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

  const title = type === "manage" ? "문제집 관리" : "풀 문제 선택";

  return (
    <section className="mx-auto w-full max-w-[80rem] p-3">
      <h1 className="mt-10 text-center text-[2rem]">{title}</h1>
      <SearchBox
        className="mt-8"
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <Suspense fallback={<CustomLoading />}>
        <ProblemSetsGrid
          debouncedSearchString={debouncedSearchString}
          isSearching={isSearching}
          pageSize={pageSize}
          type={type}
        />
      </Suspense>
      <PaginationButton
        page={problemSetsPage}
        setPage={setProblemSetsPage}
        maxPage={problemSetsMaxPage}
        className="mt-5 flex justify-center"
      />
    </section>
  );
}
