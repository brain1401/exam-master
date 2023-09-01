"use client";
import { useAtomValue, useSetAtom } from "jotai";
import {
  problemSetAtomsWithQuery,
  problemSetCurrentPageAtom,
} from "../jotai/manageProblems";
import ProblemSetCard from "./ProblemSetCard";
import { ProblemSet } from "@/types/card";
import { useEffect, useRef } from "react";

export default function ProblemSetGrid() {
  const problemSets = useAtomValue(problemSetAtomsWithQuery);
  const setCurrentPage = useSetAtom(problemSetCurrentPageAtom);
  const maxPage = useRef(problemSets?.meta.pagination.pageCount ?? 0);

  useEffect(() => {
    
    return () => {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <section>
      <ul className="flex flex-wrap">
        {problemSets?.data.map((problemSet: ProblemSet) => (
          <li key={problemSet.UUID}>
            <ProblemSetCard problemSet={problemSet} />
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={async () => {
            setCurrentPage((prev) => {
              if (prev === maxPage.current ) return prev;
              return prev + 1;
            });
          }}
        >
          다음
        </button>
        <button
          onClick={async () => {
            setCurrentPage((prev) => {
              if (prev === 1) return prev;
              return prev - 1;
            });
          }}
        >
          이전
        </button>
      </div>
    </section>
  );
}
