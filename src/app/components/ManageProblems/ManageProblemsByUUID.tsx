"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor/ProblemsEditor";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";
import CurrentProblemIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
import { ClipLoader } from "react-spinners";
import ProblemsOption from "@/app/components/ProblemsEditor/ProblemsOption";
import ManageProblemSubmitButton from "@/app/components/ManageProblems/ManageProblemSubmitButton";
import {
  problemsAtom,
  problemSetsNameAtom,
  currentTabAtom,
  localProblemSetsNameAtom,
  problemLengthAtom,
  resetProblemsAtom,
} from "@/jotai/problems";
import { useSetAtom } from "jotai";
import CustomLoading from "../ui/CustomLoading";
import ProblemEditorLayout from "../ui/ProblemEditorLayout";
type Props = {
  UUID: string;
};

export default function ManageProblemsByUUID({ UUID }: Props) {
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
          UUID,
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
        setError(err.response?.data.error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetProblems();
    };
  }, [
    UUID,
    resetProblems,
    setProblemSetsName,
    setProblems,
    setLocalProblemSetsName,
    setCurrentTab,
    setProblemLength,
  ]);

  if (error) {
    return <h1 className="mt-10 text-center text-2xl">{error}</h1>;
  }

  if (loading) {
    return <CustomLoading className="mt-20"/>;
  }

  return (
    <ProblemEditorLayout>
      <ProblemsOption />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <ManageProblemSubmitButton uuid={UUID} />
    </ProblemEditorLayout>
  );
}
