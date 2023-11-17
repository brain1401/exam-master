"use client";
import ProblemSetCard from "./ProblemSetCard";
import { RawProblemSetResponse, ProblemSetResponse } from "@/types/problems";
import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import SearchBox from "./ui/SearchBox";
import LeftRightButton from "./ui/LeftRightButton";
import useDebounce from "@/hooks/debounce";

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
  }, [page, isSearching, debouncedSearchString]);

  return (
    <section className="p-4 md:p-8">
      <SearchBox
        searchString={searchString}
        setSearchString={setSearchString}
      />

      {!loading ? (
        problemSets?.data.length && problemSets?.data.length > 0 ? (
          <ul className="mx-auto grid w-full grid-cols-1 gap-8 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {problemSets?.data.map((problemSet: ProblemSetResponse) => (
              <li
                key={problemSet.UUID}
                className="flex w-full items-center justify-center"
              >
                <ProblemSetCard problemSet={problemSet} type={type} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-lg">
              해당하는 문제집을 찾을 수 없습니다!
            </p>
          </div>
        )
      ) : (
        <div className="flex w-full items-center justify-center">
          <ClipLoader size={100} />
        </div>
      )}

      <LeftRightButton page={page} setPage={setPage} maxPage={maxPage} />
    </section>
  );
}
