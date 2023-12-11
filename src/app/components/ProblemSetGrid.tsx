"use client";
import ProblemSetCard from "./ProblemSetCard";
import { RawProblemSetResponse, ProblemSetResponse } from "@/types/problems";
import { useEffect, useLayoutEffect, useState } from "react";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";

import axios, { isAxiosError } from "axios";
import SearchBox from "./ui/SearchBox";
import useDebounce from "@/hooks/useDebounce";
import CustomLoading from "./ui/CustomLoading";
import PaginationButton from "./ui/PaginationButton";
import getPageSizeByObj from "@/utils/getPageSizeByObj";
import { useQuery } from "@tanstack/react-query";
import usePagenationState from "@/hooks/usePagenationState";

type Props = {
  type: "manage" | "exam";
};
export default function ProblemSetGrid({ type }: Props) {
  const {
    managePage,
    manageMaxPage,
    examPage,
    examMaxPage,
    setManagePage,
    setManageMaxPage,
    setExamPage,
    setExamMaxPage,
  } = usePagenationState();

  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const [pageSize, setPageSize] = useState(
    getPageSizeByObj({ isXxs, isXs, isSm, isMd, isLg, isXl }),
  );

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const page = type === "manage" ? managePage : examPage;
  const setPage = type === "manage" ? setManagePage : setExamPage;
  const maxPage = type === "manage" ? manageMaxPage : examMaxPage;
  const setMaxPage = type === "manage" ? setManageMaxPage : setExamMaxPage;

  const {
    data: problemSets,
    isError,
    isLoading,
  } = useQuery<RawProblemSetResponse>({
    queryKey: [
      "problemSets",
      page,
      pageSize,
      isSearching,
      debouncedSearchString,
    ],
    queryFn: async () => {
      let res;
      if (isSearching) {
        if (debouncedSearchString.trim().length === 0) return;
        if (pageSize === 0) return;
        res = await axios.get("/api/getProblemSetsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page,
            pageSize,
          },
        });
      } else {
        if (debouncedSearchString.trim().length > 0) return;
        if (pageSize === 0) return;
        res = await axios.get("/api/getProblemSets", {
          params: {
            page,
            pageSize,
          },
        });
      }
      const data = res.data;
      setMaxPage(data.meta.pagination.pageCount || 1);
      return res.data;
    },
  });

  const title = type === "manage" ? "문제집 관리" : "풀 문제 선택";

  // 화면 크기에 따라 페이지 사이즈 변경
  useLayoutEffect(() => {
    if (isXxs) {
      setPageSize(2);
      setPage(1);
    } else if (isXs) {
      setPageSize(4);
      setPage(1);
    } else if (isSm) {
      setPageSize(4);
      setPage(1);
    } else if (isMd) {
      setPageSize(6);
      setPage(1);
    } else if (isLg) {
      setPageSize(8);
      setPage(1);
    } else if (isXl) {
      setPageSize(10);
      setPage(1);
    }
  }, [isXxs, isXs, isSm, isMd, isLg, isXl, setPage]);

  // 검색 시 페이지 초기화
  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setPage(1);
      setIsSearching(true);
    } else {
      setPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString, setPage]);

  // 언마운트 시 페이지 초기화
  useEffect(() => {
    return () => {
      setPage(1);
    };
  }, [setPage]);

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
        page={page}
        setPage={setPage}
        maxPage={maxPage}
        className="mt-5 flex justify-center"
      />
    </section>
  );
}
