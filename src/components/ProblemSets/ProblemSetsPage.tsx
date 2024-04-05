"use client";

import { useEffect, useState } from "react";
import PaginationButton from "../ui/PaginationButton";
import usePagenationState from "@/hooks/usePagenationState";
import ProblemSetsGrid from "./ProblemSetsGrid";
import DynamicSearchBox from "../ui/DynamicSearchBox";
import useUiState from "@/hooks/useUiState";
import { useHydrateAtoms } from "jotai/utils";
import {
  problemSetsMaxPageAtom,
  problemSetsPageAtom,
  userEmailAtom,
} from "@/jotai/pagination";
import useRevalidation from "@/hooks/useRevalidate";

type Props = {
  type: "manage" | "exam";
  searchString?: string;
  userEmail: string;
  maxPage: number;
  page: number;
};

export default function ProblemSetsPage({
  type,
  searchString,
  userEmail,
  maxPage,
  page,
}: Props) {
  // 초기 hydrate시 atom도 hydrate
  useHydrateAtoms([
    [problemSetsPageAtom, page],
    [problemSetsMaxPageAtom, maxPage],
    [userEmailAtom, userEmail],
  ]);

  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const {
    problemSetsPage,
    pageSize,
    setProblemSetsMaxPage,
    setProblemSetsPage,
    setUserEmail,
  } = usePagenationState();

  useEffect(() => {
    setProblemSetsPage(page);
  }, [page, setProblemSetsPage]);

  useEffect(() => {
    setProblemSetsMaxPage(maxPage);
  }, [maxPage, setProblemSetsMaxPage]);

  useEffect(() => {
    setUserEmail(userEmail);
  }, [userEmail, setUserEmail]);

  const { revalidateAllPath } = useRevalidation();

  const [localSearchString, setLocalSearchString] = useState(
    searchString ?? "",
  );

  const [latestSearchString] = useState(localSearchString);

  useEffect(() => {
    // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
    revalidateAllPath();
  }, [revalidateAllPath]);

  useEffect(() => {
    console.log("maxPage :", maxPage);
  }, [maxPage]);

  useEffect(() => {
    console.log("problemSetsPage :", problemSetsPage);
  }, [problemSetsPage]);

  const title = type === "manage" ? "문제집 관리" : "풀 문제 선택";

  return (
    <section className="mx-auto w-full max-w-[70rem] p-3">
      <h1 className="mb-3 mt-10 text-center text-[2rem]">{title}</h1>

      <DynamicSearchBox
        searchString={localSearchString}
        setSearchString={setLocalSearchString}
        type={type}
      />

      <ProblemSetsGrid
        searchString={latestSearchString}
        pageSize={pageSize}
        type={type}
        userEmail={userEmail}
      />
      <PaginationButton
        page={problemSetsPage}
        type={type}
        maxPage={maxPage}
        searchString={searchString ?? ""}
        className="mt-10 flex justify-center pb-5"
      />
    </section>
  );
}
