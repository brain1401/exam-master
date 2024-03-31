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
import useDebounce from "@/hooks/useDebounce";
import usePrefetchPagination from "@/hooks/usePrefetchPagination";
import usePagenationState from "@/hooks/usePagenationState";
import MainProblemSetsGrid from "./MainProblemSetsGrid";
import PaginationButton from "../ui/PaginationButton";

type Props = {
  maxPage: number;
}
export default function MainPage({ maxPage }: Props) {
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
  usePrefetchPagination(
    "publicProblemSet",
    isSearching,
    debouncedSearchString,
    null,
  );

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
              <div className="mb-8 flex w-full items-center">
                <Input
                  inputClassName="flex-1"
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
                  <SelectTrigger className="w-[6rem] md:w-[8rem]">
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
          className="mt-5 pb-8"
          maxPage={publicProblemSetsMaxPage ?? maxPage}
          page={publicProblemSetsPage}
          setPage={setPublicProblemSetsPage}
        />
      </div>
    </>
  );
}
