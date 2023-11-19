"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor/ProblemsEditor";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";
import CurrentProblemIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
import { ClipLoader } from "react-spinners";
import ProblemsOption from "@/app/components/ProblemsEditor/ProblemsOption";
import ManageProblemSubmitButton from "@/app/components/ManageProblemSubmitButton";
import {
  problemsAtom,
  problemSetsNameAtom,
  currentTabAtom,
  localProblemSetsNameAtom,
  problemLengthAtom,
  resetProblemsAtom,
} from "@/jotai/problems";
import { useSetAtom } from "jotai";
type Props = {
  params: {
    UUID: string;
  };
};

export default function EditProblemsByUUID({ params }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setProblems = useSetAtom(problemsAtom);
  const setProblemSetsName = useSetAtom(problemSetsNameAtom);
  const resetProblems = useSetAtom(resetProblemsAtom);
  const setLocalProblemSetsName = useSetAtom(localProblemSetsNameAtom);
  const setCurrentTab = useSetAtom(currentTabAtom);
  const setProblemLength = useSetAtom(problemLengthAtom);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/getProblemsByUUID`, {
        params: {
          UUID: params.UUID,
        },
      })
      .then((res) => {
        setProblems(res.data.exam_problems);
        setProblemSetsName(res.data.name);
        setProblemLength(res.data.exam_problems.length);
        setLocalProblemSetsName(res.data.name);
        setCurrentTab(res.data.exam_problems[0].type);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetProblems();
    };
  }, [
    params.UUID,
    resetProblems,
    setProblemSetsName,
    setProblems,
    setLocalProblemSetsName,
    setCurrentTab,
    setProblemLength,
  ]);

  if (error) {
    return <div>존재하지 않는 문서</div>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={100} />
      </div>
    );
  }

  return (
    <section className="mx-auto my-10 max-w-[80rem] p-3">
      <ProblemsOption />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <ManageProblemSubmitButton uuid={params.UUID} />
    </section>
  );
}
