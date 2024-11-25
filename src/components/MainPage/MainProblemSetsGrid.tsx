"use client";
import { PublicProblemSetWithPagination } from "@/types/problems";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagenationState from "@/hooks/usePagenationState";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "../ui/problemGridCard";
import { fetchPublicProblemSets } from "@/utils/problems";
import PublicProblemSetsCardSkeleton from "./PublicProblemSetsCardSkeleton";
import Link from "next/link";
import usePublicProblem from "@/hooks/usePublicProblem";
import ProblemGridCardLayout from "../layouts/ProblemGridCardLayout";
import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";

export default function MainProblemSetsGrid() {
  const { setPublicProblemSetsMaxPage, publicProblemSetsPage, pageSize } =
    usePagenationState();

  const { sort, searchString } = usePublicProblem();

  useEffect(() => {
    console.log("sort :", sort);
  }, [sort]);

  const {
    data: publicProblemSets,
    isLoading,
    error,
  } = useQuery<PublicProblemSetWithPagination | null>({
    queryKey: [
      "publicProblemSets",
      publicProblemSetsPage,
      pageSize,
      searchString,
      setPublicProblemSetsMaxPage,
      sort,
    ],
    queryFn: () =>
      fetchPublicProblemSets(
        searchString,
        publicProblemSetsPage,
        pageSize,
        sort,
        setPublicProblemSetsMaxPage,
      ),
  });

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
          <ProblemSetsGridLayout type="public">
            {publicProblemSets?.data.map((publicProblemSet) => (
              <ProblemGridCardLayout key={publicProblemSet.uuid}>
                <Card className="flex h-full flex-col">
                  <Link
                    href={`/public-problem/${publicProblemSet.uuid}`}
                    className="flex h-full w-full flex-col"
                  >
                    <CardHeader className="flex-grow">
                      <CardTitle className="line-clamp-2 text-lg">
                        {publicProblemSet.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {publicProblemSet.description ?? ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-start justify-center">
                        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                          <div className="truncate">
                            {publicProblemSet.createdBy}
                          </div>
                          <div>{`${publicProblemSet.examProblemsCount}문제`}</div>
                          <div>
                            {new Date(
                              publicProblemSet.updatedAt,
                            ).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </ProblemGridCardLayout>
            ))}
          </ProblemSetsGridLayout>
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
