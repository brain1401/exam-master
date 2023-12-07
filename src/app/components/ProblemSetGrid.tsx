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

type Props = {
  type: "manage" | "exam";
};
export default function ProblemSetGrid({ type }: Props) {
  const [problemSets, setProblemSets] = useState<RawProblemSetResponse>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const title = type === "manage" ? "문제집 관리" : "풀 문제 선택";

  const [pageSize, setPageSize] = useState(
    getPageSizeByObj({ isXxs, isXs, isSm, isMd, isLg, isXl }),
  );

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
  }, [isXxs, isXs, isSm, isMd, isLg, isXl]);

  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      setPage(1);
      setIsSearching(true);
    } else {
      setPage(1);
      setIsSearching(false);
    }
  }, [debouncedSearchString]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isSearching) {
          if (debouncedSearchString.trim().length === 0) return;
          if (pageSize === 0) return;

          const res = await axios.get("/api/getProblemSetsByName", {
            params: {
              name: debouncedSearchString.trim(),
              page,
              pageSize,
            },
          });
          const data: RawProblemSetResponse = res.data;
          setMaxPage(data.meta.pagination.pageCount || 1);
          setProblemSets(data);
        } else {
          if (debouncedSearchString.trim().length > 0) return;
          if (pageSize === 0) return;
          const res = await axios.get("/api/getProblemSets", {
            params: {
              page,
              pageSize,
            },
          });
          const data: RawProblemSetResponse = res.data;
          setMaxPage(data.meta.pagination.pageCount);
          setProblemSets(data);
        }
      } catch (e) {
        if (isAxiosError(e)) {
          alert(e.response?.data.message);
        }
      } finally {
        pageSize !== 0 && setLoading(false);
      }
    };
    fetchData();
  }, [page, isSearching, debouncedSearchString, pageSize]);

  const MainContent = () => {
    if (loading) {
      return <CustomLoading />;
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
