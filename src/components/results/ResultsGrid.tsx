"use client";
import ResultsCard from "./ResultsCard";
import usePagenationState from "@/hooks/usePagenationState";
import {
  ExamResultsWithCountResponse,
  ResultsWithPagination,
} from "@/types/problems";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import CustomLoading from "../ui/CustomLoading";
import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";
import ResultsCardSkeleton from "./ResultsCardSkeleton";
import { fetchExamResults } from "@/utils/problems";

type Props = {
  pageSize: number;
  debouncedSearchString: string;
  isSearching: boolean;
  userEmail: string;
};

export default function ResultsGrid({
  pageSize,
  debouncedSearchString,
  isSearching,
  userEmail,
}: Props) {
  const { setResultsMaxPage, resultsPage } = usePagenationState();

  const {
    data: results,
    isLoading,
    error,
  } = useQuery<ResultsWithPagination | null>({
    queryKey: [
      "results",
      resultsPage,
      pageSize,
      isSearching,
      debouncedSearchString,
      setResultsMaxPage,
      userEmail,
    ],
    queryFn: () =>
      fetchExamResults(
        isSearching,
        debouncedSearchString,
        resultsPage,
        pageSize,
        setResultsMaxPage,
      ),
  });

  useEffect(() => {
    console.log("results", results);
  }, [results]);

  const MainContent = () => {
    if (error) {
      return (
        <p className="mt-10 text-center text-xl font-semibold">
          에러가 발생했습니다!
        </p>
      );
    } else if (results?.data.length === 0 && !isSearching) {
      return (
        <p className="mt-10 text-center text-xl font-semibold">
          아직 시험을 치루지 않았습니다!
        </p>
      );
    } else if (results?.data.length === 0 && isSearching) {
      return (
        <p className="mt-10 text-center text-xl font-semibold">
          검색 결과가 없습니다!
        </p>
      );
    } else {
      return (
        <>
          {results?.data && (
            <ProblemSetsGridLayout>
              {results.data.map((result) => (
                <li
                  key={result.uuid}
                  className="max-w-[50%] basis-[50%] gap-y-[1rem] px-2 md:max-w-[25%] md:basis-[25%]"
                >
                  <ResultsCard result={result} />
                </li>
              ))}
            </ProblemSetsGridLayout>
          )}
        </>
      );
    }
  };

  if (isLoading) return <ResultsCardSkeleton pageSize={pageSize} />;

  return <MainContent />;
}
