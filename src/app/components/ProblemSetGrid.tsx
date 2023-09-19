"use client";
import ProblemSetCard from "./ProblemSetCard";
import { ProblemSetResponse, ProblemSet } from "@/types/problems";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import SearchBox from "./ui/SearchBox";
import LeftRightButton from "./ui/LeftRightButton";

export default function ProblemSetGrid() {
  const [problemSets, setProblemSets] = useState<ProblemSetResponse>();
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const maxPage = useRef<number>(0);

  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/getProblemSets", {
        params: {
          page,
        },
      })
      .then((res) => {
        const data: ProblemSetResponse = res.data;
        maxPage.current = data.meta.pagination.pageCount;
        setProblemSets(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

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
          <li key={problemSet.UUID} className="flex justify-center">
            <ProblemSetCard problemSet={problemSet} />
          </li>
        ))}
      </ul>

      <LeftRightButton page={page} setPage={setPage} maxPage={maxPage.current} />
    </section>
  );
}
