"use client";
import ProblemSetCard from "./ProblemSetCard";
import { RawProblemSetResponse, ProblemSetResponse } from "@/types/problems";
import { useEffect, useLayoutEffect, useState } from "react";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";

import SearchBox from "./ui/SearchBox";
import useDebounce from "@/hooks/useDebounce";
import CustomLoading from "./ui/CustomLoading";
import PaginationButton from "./ui/PaginationButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePagenationState from "@/hooks/usePagenationState";
import { fetchProblemSets, getProblemSetsMaxPage } from "@/service/problems";

type Props = {
  type: "manage" | "exam";
};
export default function ProblemSetGrid({ type }: Props) {
  // 화면 전환 시 자연스러운 페이지네이션 바를 위한 전역 상태
  const {
    setProblemSetsPage,
    setProblemSetsMaxPage,
    problemSetsMaxPage,
    problemSetsPage,
  } = usePagenationState();

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();

  //화면 너비에 따라 pagination 사이즈 변경하기 위한 media query
  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const [pageSize, setPageSize] = useState(0);

  const {
    data: problemSets,
    isError,
    isLoading,
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

  // 페이지네이션 데이터 prefetch
  useEffect(() => {
    const prefetch = async () => {
      if (pageSize === 0) return;

      const fetchs: Promise<any>[] = [];

      let maxPage =
        (await getProblemSetsMaxPage(
          isSearching,
          debouncedSearchString,
          pageSize,
        )) || 1;

      console.log("maxPage", maxPage);

      for (let i = 1; i <= maxPage; i++) {
        queryClient.prefetchQuery({
          queryKey: [
            "problemSets",
            i,
            pageSize,
            isSearching,
            debouncedSearchString,
            setProblemSetsMaxPage,
          ],
          queryFn: () =>
            fetchProblemSets(
              isSearching,
              debouncedSearchString,
              i,
              pageSize,
              setProblemSetsMaxPage,
            ),
        });
      }

      Promise.all(fetchs);
    };

    prefetch();
  }, [
    pageSize,
    debouncedSearchString,
    queryClient,
    setProblemSetsMaxPage,
    isSearching,
  ]);

  const title = type === "manage" ? "문제집 관리" : "풀 문제 선택";

  // 화면 크기에 따라 페이지 사이즈 변경
  useLayoutEffect(() => {
    if (isXxs) {
      setPageSize(2);
      setProblemSetsPage(1);
    } else if (isXs) {
      setPageSize(4);
      setProblemSetsPage(1);
    } else if (isSm) {
      setPageSize(4);
      setProblemSetsPage(1);
    } else if (isMd) {
      setPageSize(6);
      setProblemSetsPage(1);
    } else if (isLg) {
      setPageSize(8);
      setProblemSetsPage(1);
    } else if (isXl) {
      setPageSize(10);
      setProblemSetsPage(1);
    }
  }, [isXxs, isXs, isSm, isMd, isLg, isXl, setProblemSetsPage]);

  // 검색 시 페이지 초기화
  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setProblemSetsPage(1);
      setIsSearching(true);
    } else {
      setProblemSetsPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString, setProblemSetsPage]);

  // 언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setProblemSetsPage(1);
    };
  }, [setProblemSetsPage]);

  const MainContent = () => {
    if (isLoading) {
      return <CustomLoading />;
    } else if (isError) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-center text-lg">
            문제집을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      );
    } else if (!(problemSets?.data.length && problemSets?.data.length > 0)) {
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
              <ProblemSetCard problemSet={problemSet} type={type} />
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-[80rem] p-3">
      <h1 className="mt-10 text-center text-[2rem]">{title}</h1>
      <SearchBox
        className="mt-8"
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <MainContent />
      <PaginationButton
        page={problemSetsPage}
        setPage={setProblemSetsPage}
        maxPage={problemSetsMaxPage}
        className="mt-5 flex justify-center"
      />
    </section>
  );
}
