"use client";
import { useAtomValue, useSetAtom } from "jotai";
import {
  problemSetAtomsWithQuery,
  problemSetCurrentPageAtom,
} from "../jotai/manageProblems";
import ProblemSetCard from "./ProblemSetCard";
import { ProblemSet } from "@/types/card";
import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { BsSearch } from "react-icons/bs";

export default function ProblemSetGrid() {
  const problemSets = useAtomValue(problemSetAtomsWithQuery);
  const setCurrentPage = useSetAtom(problemSetCurrentPageAtom);
  const maxPage = useRef(problemSets?.meta.pagination.pageCount ?? 0);

  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    return () => {
      setCurrentPage(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="flex justify-end items-center h-10">
        <div className="flex justify-center items-center">
          <input
            type="text"
            className="border border-black rounded-md py-1 mx-auto"
            name="search"
            id="search"
            placeholder="검색어를 입력하세요."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button className="ml-1 p-2 justify-center items-center text-center">
            <BsSearch />
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-5 w-[55rem] mx-auto">
        {problemSets?.data.map((problemSet: ProblemSet) => (
          <li key={problemSet.UUID} className="flex justify-center">
            <ProblemSetCard problemSet={problemSet} />
          </li>
        ))}
      </ul>

      <div className="flex gap-3 justify-center mt-5">
        <Button
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === 1) return prev;
              return prev - 1;
            });
          }}
        >
          이전
        </Button>

        <Button
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === maxPage.current) return prev;
              return prev + 1;
            });
          }}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
