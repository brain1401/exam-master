"use client";
import { PublicProblemSetWithPagination } from "@/types/problems";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "../ui/button";

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
} from "../ui/card";
import { fetchPublicProblemSets } from "@/utils/problems";
import PublicProblemSetsCardSkeleton from "./PublicProblemSetsCardSkeleton";
import Link from "next/link";

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
          <div className="mx-auto flex w-full max-w-[70rem]">
            <div className="flex min-w-0 flex-1 flex-row flex-wrap gap-y-[1rem]">
              {publicProblemSets?.data.map((publicProblemSet) => (
                <Card
                  key={publicProblemSet.uuid}
                  className="h-full cursor-pointer hover:shadow-md"
                  wrapperClassName="px-2 max-w-[50%] basis-[50%] md:max-w-[25%] md:basis-[25%]"
                >
                  <Link href={`/problem/${publicProblemSet.uuid}`} className="flex flex-col w-full h-full">
                    <CardHeader className="pb-0">
                      <CardTitle className="truncate">{publicProblemSet.name}</CardTitle>
                      {publicProblemSet.description ? (
                        <CardDescription className="truncate">
                          {publicProblemSet.description}
                        </CardDescription>
                      ) : null}
                    </CardHeader>
                    <CardContent>
                      <div className="flex w-full ">
                        <div className="flex flex-col items-start justify-center space-y-2">
                          <div className="space-y-1 text-start text-[.9rem] text-gray-500 dark:text-gray-400">
                            <div>{publicProblemSet.createdBy}</div>
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
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
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
