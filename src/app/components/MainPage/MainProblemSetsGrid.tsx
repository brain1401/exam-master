"use client";
import { PublicProblemSetWithPagination } from "@/types/problems";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagenationState from "@/hooks/usePagenationState";
import { Card, CardContent } from "../ui/card";
import { fetchPublicProblemSets } from "@/utils/problems";
import PublicProblemSetsCardSkeleton from "./PublicProblemSetsCardSkeleton";

type Props = {
  debouncedSearchString: string;
  pageSize: number;
  isSearching: boolean;
};

export default function MainProblemSetsGrid({
  debouncedSearchString,
  isSearching,
  pageSize,
}: Props) {
  const { setPublicProblemSetsMaxPage, publicProblemSetsPage } =
    usePagenationState();

  const {
    data: publicProblemSets,
    isLoading,
    error,
  } = useQuery<PublicProblemSetWithPagination | null>({
    queryKey: [
      "publicProblemSets",
      publicProblemSetsPage,
      pageSize,
      isSearching,
      debouncedSearchString,
      setPublicProblemSetsMaxPage,
    ],
    queryFn: () =>
      fetchPublicProblemSets(
        isSearching,
        debouncedSearchString,
        publicProblemSetsPage,
        pageSize,
        setPublicProblemSetsMaxPage,
      ),
  });

  useEffect(() => {
    console.log("publicProblemSets", publicProblemSets);
  }, [publicProblemSets]);

  const MainContent = () => {
    if (publicProblemSets?.data.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-center text-lg">
            해당하는 문제집을 찾을 수 없습니다!
          </p>
        </div>
      );
    } else {
      return (
        publicProblemSets?.data && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicProblemSets?.data.map((publicProblemSet) => (
              <Card key={publicProblemSet.uuid}>
                <CardContent className="flex flex-col items-start justify-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {publicProblemSet.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <div>{publicProblemSet.createdBy}</div>
                    <div>{new Date(publicProblemSet.updatedAt).toLocaleDateString("ko-KR")}</div>
                    <div>{`${publicProblemSet.examProblemsCount}문제`}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      );
    }
  };

  if (isLoading) return <PublicProblemSetsCardSkeleton pageSize={pageSize} />;

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
