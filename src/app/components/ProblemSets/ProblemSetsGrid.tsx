"use client";
import ProblemSetsCard from "./ProblemSetsCard";
import { RawProblemSetResponse, ProblemSetResponse } from "@/types/problems";
import { useQuery } from "@tanstack/react-query";
import { fetchProblemSets } from "@/service/problems";
import { useEffect, useState } from "react";
import usePagenationState from "@/hooks/usePagenationState";
import ProblemSetsCardSkeleton from "./ProblemSetsCardSkeleton";
import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";

type Props = {
  type: "manage" | "exam";
  debouncedSearchString: string;
  pageSize: number;
  isSearching: boolean;
};

export type IsSelected = { uuid: string; isSelected: boolean };

export default function ProblemSetsGrid({
  type,
  debouncedSearchString,
  isSearching,
  pageSize,
}: Props) {
  const { setProblemSetsMaxPage, problemSetsPage } = usePagenationState();

  const {
    data: problemSets,
    isLoading,
    error,
  } = useQuery<RawProblemSetResponse>({
    queryKey: [
      "problemSets",
      problemSetsPage,
      pageSize,
      isSearching,
      debouncedSearchString,
      setProblemSetsMaxPage,
    ],
    queryFn: () =>
      fetchProblemSets(
        isSearching,
        debouncedSearchString,
        problemSetsPage,
        pageSize,
        setProblemSetsMaxPage,
      ),
  });

  useEffect(() => {
    console.log("problemSets", problemSets);
  }, [problemSets]);

  const MainContent = () => {
    if (problemSets?.data.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-center text-lg">
            해당하는 문제집을 찾을 수 없습니다!
          </p>
        </div>
      );
    } else {
      return (
        <>
          {problemSets?.data && (
            <ProblemSetsGridLayout>
              {problemSets?.data.map((problemSet: ProblemSetResponse) => (
                <li
                  key={problemSet.UUID}
                  className="mx-auto flex w-full max-w-[13rem] items-center justify-center"
                >
                  <ProblemSetsCard problemSet={problemSet} type={type} />
                </li>
              ))}
            </ProblemSetsGridLayout>
          )}
        </>
      );
    }
  };

  if (isLoading) return <ProblemSetsCardSkeleton pageSize={pageSize} />;

  if (error)
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <h1 className="text-center text-3xl">
          서버가 응답하지 않습니다 다시 시도해주시거나 나중에 다시 시도해주세요.
        </h1>
      </div>
    );

  return <MainContent />;
}
