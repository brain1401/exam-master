"use client";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import useResponsivePageSize from "@/hooks/useResponsivePageSize";
import useDebounce from "@/hooks/useDebounce";
import usePrefetchPagination from "@/hooks/usePrefetchPagination";
import usePagenationState from "@/hooks/usePagenationState";
import MainProblemSetsGrid from "./MainProblemSetsGrid";
import Pagenation from "@/slices/pagenation";
import PaginationButton from "../ui/PaginationButton";

export default function MainPage() {
  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const {
    setPublicProblemSetsPage,
    publicProblemSetsMaxPage,
    publicProblemSetsPage,
    pageSize,
  } = usePagenationState();

  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  //모든 페이지네이션 list prefetch
  usePrefetchPagination("publicProblemSet", isSearching, debouncedSearchString);

  // 화면 크기에 따라 페이지 사이즈 변경
  useResponsivePageSize("publicProblemSet");

  // 검색 시 페이지 초기화
  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setPublicProblemSetsPage(1);
      setIsSearching(true);
    } else {
      setPublicProblemSetsPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString, setPublicProblemSetsPage]);

  // 언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setPublicProblemSetsPage(1);
    };
  }, [setPublicProblemSetsPage]);

  return (
    <>
      <div className="">
        <div className="mx-auto w-full max-w-[58rem] px-5">
          <div>{/* 광고 */}</div>
          <div>
            <div className="flex w-full flex-col pt-10">
              <h2 className="mb-4 text-[1.5rem] font-semibold text-gray-900 dark:text-gray-50">
                공개된 문제집
              </h2>
              <div className="mb-8 flex w-full items-center justify-between">
                <Input
                  wrapperClassName="mr-4 flex-1"
                  placeholder="문제 세트 검색"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <Select
                  defaultValue="popular"
                  onValueChange={(value) =>
                    setSort(value as "newest" | "popular")
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="newest">최신순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>{/* 광고 */}</div>
        </div>
        <div className="px-2">
          <MainProblemSetsGrid
            debouncedSearchString={debouncedSearchString}
            isSearching={isSearching}
            pageSize={pageSize}
          />
        </div>
        <PaginationButton
          className="my-3"
          maxPage={publicProblemSetsMaxPage}
          page={publicProblemSetsPage}
          setPage={setPublicProblemSetsPage}
        />
      </div>
    </>
  );
}
