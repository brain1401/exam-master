"use client";

import { SortType } from "@/types/problems";
import MainPageSearchBar from "./MainPageSearchBar";
import { useHydrateAtoms } from "jotai/utils";
import {
  publicProblemSetsMaxPageAtom,
  publicProblemSetsPageAtom,
} from "@/jotai/pagination";
import {
  publicProblemSetSearchStringAtom,
  publicProblemSetSortAtom,
} from "@/jotai/publicProblem";
import MainProblemSetsGrid from "./MainProblemSetsGrid";
import PaginationButton from "../ui/PaginationButton";
import { useEffect } from "react";
import usePagenationState from "@/hooks/usePagenationState";
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
  useHydrateAtoms(
    [
      [publicProblemSetsPageAtom, page],
      [publicProblemSetsMaxPageAtom, maxPage],
      [publicProblemSetSearchStringAtom, searchString ?? ""],
    ],
    {
      dangerouslyForceHydrate: true,
    },
  );

  const { publicProblemSetsPage, publicProblemSetsMaxPage } =
    usePagenationState();
  const { searchString: search, sort } = usePublicProblem();

  useEffect(() => {
    console.log("searchString :", search);
  }, [search]);

  useEffect(() => {
    console.log("sortString :", sort);
  }, [sort]);

  useEffect(() => {
    console.log("publicProblemSetsPage :", publicProblemSetsPage);
  }, [publicProblemSetsPage]);

  useEffect(() => {
    console.log("publicProblemSetsMaxPage :", publicProblemSetsMaxPage);
  }, [publicProblemSetsMaxPage]);

  return (
    <div className="mx-auto flex w-full max-w-[60rem] justify-center px-5">
      <div>{/* 광고 */}</div>
      <div className="flex-1">
        <div>
          <div className="flex w-full flex-col pt-10">
            <h2 className="mb-4 text-[1.5rem] font-semibold text-gray-900 dark:text-gray-50">
              공개된 문제집
            </h2>
            <div className="mb-8 flex w-full items-center">
              <MainPageSearchBar />
            </div>
          </div>
        </div>
        <div className="px-2">
          <MainProblemSetsGrid />
        </div>
        <PaginationButton className="mt-5 pb-8" type="public" />
      </div>

      <div>{/*광고*/}</div>
    </div>
  );
}
