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
import usePagenationState from "@/hooks/usePagenationState";
import MainProblemSetsGrid from "./MainProblemSetsGrid";
import PaginationButton from "../ui/PaginationButton";
import { useHydrateAtoms } from "jotai/utils";
import {
  publicProblemSetsMaxPageAtom,
  publicProblemSetsPageAtom,
} from "@/jotai/pagination";
import { IoSearchOutline } from "react-icons/io5";
import useRevalidation from "@/hooks/useRevalidate";
import Link from "next/link";
import usePublicProblem from "@/hooks/usePublicProblem";

type Props = {
  maxPage: number;
  page: number;
  searchString?: string;
};
export default function PublicProblemsPage({
  maxPage,
  page,
  searchString,
}: Props) {
  useHydrateAtoms([
    [publicProblemSetsPageAtom, page],
    [publicProblemSetsMaxPageAtom, maxPage],
  ]);

  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const { setPublicProblemSetsPage, publicProblemSetsPage } =
    usePagenationState();

  const { revalidatePathAndRedirect, revalidateAllPath } = useRevalidation();

  const { sort, setSort } = usePublicProblem();

  const [localSearchString, setLocalSearchString] = useState(
    searchString ?? "",
  );

  const [latestSearchString] = useState(localSearchString);

  // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
  useEffect(() => {
    revalidateAllPath();
    console.log("revalidateAllPath");
  }, [revalidateAllPath]);

  const handleSearch = () => {
    if (localSearchString.length === 0) {
      setPublicProblemSetsPage(1);
      revalidatePathAndRedirect({
        path: "/",
        redirectPath: "/",
      });
    } else {
      revalidatePathAndRedirect({
        path: `/search/${encodeURIComponent(localSearchString)}`,
        redirectPath: `/search/${encodeURIComponent(localSearchString)}`,
      });
    }
  };

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
                  endContent={
                    <Link
                      href={
                        localSearchString
                          ? `/search/${encodeURIComponent(localSearchString)}`
                          : "/"
                      }
                    >
                      <IoSearchOutline className="h-5 w-5 cursor-pointer" />
                    </Link>
                  }
                  value={localSearchString}
                  onChange={(e) => setLocalSearchString(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
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
                  <SelectContent className="z-20">
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
          <MainProblemSetsGrid searchString={latestSearchString} />
        </div>
        <PaginationButton
          className="mt-5 pb-8"
          maxPage={maxPage}
          page={publicProblemSetsPage}
          searchString={latestSearchString}
          type="public"
        />
      </div>
    </>
  );
}
