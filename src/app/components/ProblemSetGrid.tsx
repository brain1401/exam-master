"use client";
import ProblemSetCard from "./ProblemSetCard";
import { RawProblemSetResponse, ProblemSetResponse } from "@/types/problems";
import { useEffect, useState } from "react";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";

import axios from "axios";
import SearchBox from "./ui/SearchBox";
import useDebounce from "@/hooks/debounce";
import CustomLoading from "./ui/CustomLoading";
import PaginationButton from "./ui/PaginationButton";

type Props = {
  type: "manage" | "exam";
};
export default function ProblemSetGrid({ type }: Props) {
  const [problemSets, setProblemSets] = useState<RawProblemSetResponse>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

  const { isXxs, isXs, isSm, isMd, isLg, isXl } = useCustomMediaQuery();

  useEffect(() => {
    if (isXxs) setPageSize(2);
    else if (isXs) setPageSize(4);
    else if (isSm) setPageSize(4);
    else if (isMd) setPageSize(6);
    else if (isLg) setPageSize(8);
    else if (isXl) setPageSize(10);
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
    setLoading(true);

    if (isSearching) {
      if (debouncedSearchString.trim().length === 0) return;
      axios
        .get("/api/getProblemSetsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page,
            pageSize,
          },
        })
        .then((res) => {
          const data: RawProblemSetResponse = res.data;
          setMaxPage(data.meta.pagination.pageCount || 1);
          setProblemSets(data);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .get("/api/getProblemSets", {
          params: {
            page,
            pageSize,
          },
        })
        .then((res) => {
          const data: RawProblemSetResponse = res.data;
          setMaxPage(data.meta.pagination.pageCount);
          setProblemSets(data);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setLoading(false);
        });
    }
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
    <section className="">
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
