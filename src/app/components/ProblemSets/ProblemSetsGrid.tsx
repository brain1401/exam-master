"use client";
import ProblemSetsCard from "./ProblemSetsCard";
import { ProblemSet, ProblemSetWithPagination } from "@/types/problems";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagenationState from "@/hooks/usePagenationState";
import ProblemSetsCardSkeleton from "./ProblemSetsCardSkeleton";
import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";
import { fetchProblemSets } from "@/utils/problems";

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
  } = useQuery<ProblemSetWithPagination | null>({
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
        problemSets?.data && (
          <ProblemSetsGridLayout>
            {problemSets.data.map((problemSet: ProblemSet) => (
              <li
                key={problemSet.uuid}
                className="h-full max-w-[50%] basis-[50%] px-2 md:max-w-[25%] md:basis-[25%]"
              >
                <ProblemSetsCard problemSet={problemSet} type={type} />
              </li>
            ))}
          </ProblemSetsGridLayout>
        )
      );
    }
  };

  if (isLoading) return <ProblemSetsCardSkeleton pageSize={pageSize} />;

  if (error)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-center text-3xl">
          서버가 응답하지 않습니다 다시 시도해주시거나 나중에 다시 시도해주세요.
        </h1>
      </div>
    );

  return <MainContent />;
}
