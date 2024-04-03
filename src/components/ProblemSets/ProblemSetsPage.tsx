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
  useHydrateAtoms([
    [problemSetsPageAtom, page],
    [problemSetsMaxPageAtom, maxPage],
  ]);

  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const { setProblemSetsPage, problemSetsMaxPage, problemSetsPage, pageSize } =
    usePagenationState();

  const { revalidateAllPath } = useRevalidation();

  const [localSearchString, setLocalSearchString] = useState(
    searchString ?? "",
  );

  const [latestSearchString] = useState(localSearchString);

  useEffect(() => {
    // 다음 네비게이션 시 서버 컴포넌트 캐싱 무효화
    revalidateAllPath();
  }, [revalidateAllPath]);

  // 언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setProblemSetsPage(1);
    };
  }, [setProblemSetsPage]);

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
        searchString={searchString}
        className="mt-10 flex justify-center pb-5"
      />
    </section>
  );
}
