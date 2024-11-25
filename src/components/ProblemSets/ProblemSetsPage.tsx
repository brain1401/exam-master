"use client";

import { useEffect, useState } from "react";
import PaginationButton from "../ui/PaginationButton";
import usePagenationState from "@/hooks/usePagenationState";
import ProblemSetsGrid from "./ProblemSetsGrid";
import DynamicSearchBox from "../ui/DynamicSearchBox";
import { useHydrateAtoms } from "jotai/utils";
import {
  problemSetsMaxPageAtom,
  problemSetsPageAtom,
  userEmailAtom,
} from "@/jotai/pagination";
import useRevalidation from "@/hooks/useRevalidate";
import { useQuery } from "@tanstack/react-query";
import { defaultPageSize } from "@/const/pageSize";
import { fetchProblemSets } from "@/utils/problems";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useExamExternelState } from "@/hooks/useTimeLimit";

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

  const { data: problemSets } = useQuery({
    queryKey: [
      "problemSets",
      page,
      defaultPageSize,
      searchString ?? "",
      setProblemSetsMaxPage,
      userEmail,
    ],
    queryFn: () =>
      searchString
        ? fetchProblemSets(
            searchString,
            page,
            defaultPageSize,
            setProblemSetsMaxPage,
          )
        : fetchProblemSets("", page, defaultPageSize, setProblemSetsMaxPage),
  });

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

  const { setIsRandomExam } = useExamExternelState();

  const [localIsRandomExam, setLocalIsRandomExam] = useState(false);

  const [latestSearchString] = useState(localSearchString);

  useEffect(() => {
    // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
    revalidateAllPath();
  }, [revalidateAllPath]);

  useEffect(() => {
    setIsRandomExam(localIsRandomExam);
  }, [localIsRandomExam, setIsRandomExam]);

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

      {type === "exam" ? (
        <div className="flex items-center justify-start">
          <Label htmlFor="isRandom" className="mr-2 translate-y-[-.1rem]">
            랜덤으로 풀기
          </Label>
          <Switch
            id="isRandom"
            checked={localIsRandomExam}
            onCheckedChange={setLocalIsRandomExam}
          />
        </div>
      ) : null}

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
        page={problemSets?.pagination.page || 1}
        maxPage={problemSets?.pagination.pageCount || 1}
        type={type}
        searchString={searchString ?? ""}
        className="mt-10 flex justify-center pb-5"
      />
    </section>
  );
}
