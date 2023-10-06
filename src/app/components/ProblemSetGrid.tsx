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
  const [isPageResetting, setIsPageResetting] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  useEffect(() => {
    if (isPageResetting === false) {
      if (debouncedSearchString.length === 0) {
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
      } else {
        if (page > 1) {
          setPage(1);
          setIsPageResetting(true);
        }
        axios
          .get("/api/getProblemSetsByName", {
            params: {
              name: debouncedSearchString.trim(),
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
    } else {
      setIsPageResetting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearchString]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={100} />
      </div>
    );
  }

  return (
    <section className="p-4 md:p-8">
      <SearchBox
        searchString={searchString}
        setSearchString={setSearchString}
      />

      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 xl:grid-cols-5  gap-4 w-full mx-auto">
        {problemSets?.data.map((problemSet: ProblemSet) => (
          <li key={problemSet.UUID}>
            <ProblemSetCard problemSet={problemSet} type={type} />
          </li>
        ))}
      </ul>

      <LeftRightButton page={page} setPage={setPage} maxPage={maxPage} />
    </section>
  );
}
