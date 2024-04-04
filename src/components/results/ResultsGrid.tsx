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
import ProblemGridCardLayout from "../layouts/ProblemGridCardLayout";

type Props = {
  pageSize: number;
  searchString: string;
  userEmail: string;
};

export default function ResultsGrid({
  pageSize,
  searchString,
  userEmail,
}: Props) {
  const { setResultsMaxPage, resultPage } = usePagenationState();

  const {
    data: results,
    isLoading,
    error,
  } = useQuery<ResultsWithPagination | null>({
    queryKey: [
      "results",
      resultPage,
      pageSize,
      searchString,
      setResultsMaxPage,
      userEmail,
    ],
    queryFn: () =>
      fetchExamResults(searchString, resultPage, pageSize, setResultsMaxPage),
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
    } else if (results?.data.length === 0) {
      return (
        <p className="mt-10 text-center text-xl font-semibold">
          아직 시험을 치루지 않았습니다!
        </p>
      );
    } else if (results?.data.length === 0 && searchString !== "") {
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
                <ProblemGridCardLayout key={result.uuid}>
                  <ResultsCard result={result} />
                </ProblemGridCardLayout>
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
