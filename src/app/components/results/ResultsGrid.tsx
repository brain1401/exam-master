"use client";
import ResultsCard from "./ResultsCard";
import usePagenationState from "@/hooks/usePagenationState";
import { fetchExamResults } from "@/service/problems";
import { ExamResultsWithCountResponse } from "@/types/problems";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import CustomLoading from "../ui/CustomLoading";
import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";
import ResultsCardSkeleton from "./ResultsCardSkeleton";

type Props = {
  pageSize: number;
  debouncedSearchString: string;
  isSearching: boolean;
};

export default function ResultsGrid({
  pageSize,
  debouncedSearchString,
  isSearching,
}: Props) {
  const { setResultsMaxPage, resultsPage } = usePagenationState();

  const {
    data: results,
    isLoading,
    error,
  } = useQuery<ExamResultsWithCountResponse>({
    queryKey: [
      "results",
      resultsPage,
      pageSize,
      isSearching,
      debouncedSearchString,
      setResultsMaxPage,
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
    if (results?.data.length === 0 && !isSearching) {
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
                <li key={result.uuid} className="">
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
