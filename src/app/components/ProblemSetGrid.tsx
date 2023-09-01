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
  }, []);

  return (
    <section className="p-4 md:p-8">
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center border rounded-full pl-3 pr-2">
          <input
            type="text"
            className="flex-grow py-2 pl-4 rounded-full focus:outline-none focus:border-indigo-500"
            name="search"
            id="search"
            placeholder="검색어를 입력하세요."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button className="p-3"> 
            <BsSearch className="text-gray-400" />
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 xl:grid-cols-5  gap-4 w-full mx-auto">
        {problemSets?.data.map((problemSet: ProblemSet) => (
          <li key={problemSet.UUID} className="flex justify-center">
            <ProblemSetCard problemSet={problemSet} />
          </li>
        ))}
      </ul>

      <div className="flex gap-3 justify-center mt-5">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm md:text-base"
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
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm md:text-base"
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
