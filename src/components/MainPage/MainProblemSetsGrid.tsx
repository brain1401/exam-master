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
  CardFooter,
} from "../ui/problemGridCard";
import { fetchPublicProblemSets } from "@/utils/problems";
import PublicProblemSetsCardSkeleton from "./PublicProblemSetsCardSkeleton";
import Link from "next/link";
import usePublicProblem from "@/hooks/usePublicProblem";
import ProblemGridCardLayout from "../layouts/ProblemGridCardLayout";

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
          <ul className="flex w-full flex-1 flex-row justify-between flex-wrap gap-y-[1rem]">
            {publicProblemSets?.data.map((publicProblemSet, i) => (
              <ProblemGridCardLayout key={publicProblemSet.uuid}>
                <Card>
                  <Link
                    href={`/problem/${publicProblemSet.uuid}`}
                    className="flex h-full w-full flex-col"
                  >
                    <CardHeader>
                      <CardTitle>{publicProblemSet.name}</CardTitle>
                      <CardDescription>
                        {publicProblemSet.description ?? ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-start justify-center">
                        <div className="space-y-[.002rem] text-[.9rem] text-gray-500 dark:text-gray-400">
                          <div className="text-[.8rem]">
                            {publicProblemSet.createdBy}
                          </div>
                          <div className="text-[.8rem]">{`${publicProblemSet.examProblemsCount}문제`}</div>
                          <div className="text-[.8rem]">
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
          </ul>
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
