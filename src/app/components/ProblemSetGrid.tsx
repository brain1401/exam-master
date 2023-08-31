"use client";
import { useAtom } from "jotai";
import { problemSetsAtom } from "../jotai/manageProblems";
import ProblemSet from "../components/ProblemSet";
import { useEffect } from "react";
import axios from "axios";

export default function ProblemSetGrid() {
  const [problemSets, setProblemSets] = useAtom(problemSetsAtom);

  useEffect(() => {
    axios.get(`/api/getProblemSets`).then((res) => {
      setProblemSets(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <ul>
        {problemSets.map((problemSet) => (
          <>
            <li>
              <ProblemSet key={problemSet.UUID} problemSet={problemSet} />
            </li>
          </>
        ))}
      </ul>
    </section>
  );
}
