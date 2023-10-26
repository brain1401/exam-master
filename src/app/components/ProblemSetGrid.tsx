"use client";
import ProblemSetCard from "./ProblemSetCard";
import { ProblemSetResponse, ProblemSet } from "@/types/problems";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import SearchBox from "./ui/SearchBox";
import LeftRightButton from "./ui/LeftRightButton";
import useDebounce from "@/hooks/debounce";

type Props = {
  type: "manage" | "exam";
};
export default function ProblemSetGrid({ type }: Props) {
  const [problemSets, setProblemSets] = useState<ProblemSetResponse>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const [isSearching, setIsSearching] = useState(false);

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
          },
        })
        .then((res) => {
          const data: ProblemSetResponse = res.data;
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
          },
        })
        .then((res) => {
          const data: ProblemSetResponse = res.data;
          setMaxPage(data.meta.pagination.pageCount);
          setProblemSets(data);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [page, isSearching, debouncedSearchString]);

  return (
    <section className="p-4 md:p-8">
      <SearchBox
        searchString={searchString}
        setSearchString={setSearchString}
      />

      {!loading ? (
        problemSets?.data.length && problemSets?.data.length > 0 ? (
          <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 xl:grid-cols-5  gap-4 w-full mx-auto">
            {problemSets?.data.map((problemSet: ProblemSet) => (
              <li key={problemSet.UUID}>
                <ProblemSetCard problemSet={problemSet} type={type} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-lg">
              해당하는 문제집을 찾을 수 없습니다!
            </p>
          </div>
        )
      ) : (
        <div className="flex w-full justify-center items-center h-screen">
          <ClipLoader size={100} />
        </div>
      )}

      <LeftRightButton page={page} setPage={setPage} maxPage={maxPage} />
    </section>
  );
}
