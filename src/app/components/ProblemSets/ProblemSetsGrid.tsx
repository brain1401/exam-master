"use client";
import ProblemSetsCard from "./ProblemSetsCard";
import { RawProblemSetResponse, ProblemSetResponse } from "@/types/problems";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProblemSets } from "@/service/problems";
import { useEffect } from "react";
import usePagenationState from "@/hooks/usePagenationState";

type Props = {
  type: "manage" | "exam";
  debouncedSearchString: string;
  pageSize: number;
  isSearching: boolean;
};

export default function ProblemSetsGrid({
  type,
  debouncedSearchString,
  isSearching,
  pageSize,
}: Props) {
  const { setProblemSetsMaxPage, problemSetsPage } = usePagenationState();
  
  const { data: problemSets } = useSuspenseQuery<RawProblemSetResponse>({
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
  })

  const MainContent = () => {
    if ((problemSets?.data.length && problemSets?.data.length === 0)) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-center text-lg">
            해당하는 문제집을 찾을 수 없습니다!
          </p>
        </div>
      );
    } else {
      return (
        <ul className="mx-auto mt-10 grid w-full grid-cols-1 gap-x-2 gap-y-5 px-0 xs:grid-cols-2 sm:grid-cols-2 sm:p-0 min-[669px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {problemSets?.data.map((problemSet: ProblemSetResponse) => (
            <li
              key={problemSet.UUID}
              className="mx-auto flex w-full max-w-[13rem] items-center justify-center"
            >
              <ProblemSetsCard problemSet={problemSet} type={type} />
            </li>
          ))}
        </ul>
      );
    }
  };

  return <MainContent />;
}
