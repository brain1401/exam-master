"use client";
import ProblemsEditor from "@/components/ProblemsEditor/ProblemsEditor";
import NextOrPrevButtons from "@/components/CreateProblems/NextOrPrevButtons";
import CurrentProblemIndicator from "@/components/CreateProblems/CurrentCardIndicator";
import ProblemsOption from "@/components/ProblemsEditor/ProblemsOption";
import ManageProblemSubmitButton from "@/components/ManageProblems/ManageProblemSubmitButton";
import ProblemEditorLayout from "../layouts/ProblemEditorLayout";
import useProblems from "@/hooks/useProblems";
import { Button } from "../ui/button";
import { FiShare } from "react-icons/fi";
import { ProblemSetWithName } from "@/types/problems";
import { useHydrateAtoms } from "jotai/utils";
import {
  problemsAtom,
  candidatesCountAtom,
  currentProblemIndexAtom,
  currentTabAtom,
  descriptionAtom,
  isPublicAtom,
  localProblemSetsNameAtom,
  problemLengthAtom,
  problemSetsNameAtom,
  timeLimitAtom,
} from "@/jotai/problems";
import { useEffect } from "react";

type Props = {
  UUID: string;
  problemSet: ProblemSetWithName;
};

export default function ManageProblemsByUUID({ UUID, problemSet }: Props) {
  // useHydrateAtoms를 통해 서버 컴포넌트에서 받아온 값을 jotai atom에 초기값으로 설정
  useHydrateAtoms([
    [problemsAtom, problemSet.problems],
    [isPublicAtom, problemSet.isPublic],
    [descriptionAtom, problemSet.description ?? ""],
    [problemSetsNameAtom, problemSet.name],
    [problemLengthAtom, problemSet.problems.length.toString()],
    [localProblemSetsNameAtom, problemSet.name],
    [currentTabAtom, problemSet.problems[0]?.type as "obj" | "sub"],
    [currentProblemIndexAtom, 0],
    [
      candidatesCountAtom,
      problemSet.problems[0]?.candidates?.length.toString() ?? "4",
    ],
    [timeLimitAtom, problemSet.timeLimit?.toString() || "1"],
  ]);

  const { resetProblems } = useProblems();

  useEffect(() => {
    () => resetProblems();
  }, [resetProblems]);

  return (
    <ProblemEditorLayout>
      <ProblemsOption type="manage" />

      <CurrentProblemIndicator />

      <ProblemsEditor />

      <NextOrPrevButtons />

      <ManageProblemSubmitButton uuid={UUID} />
    </ProblemEditorLayout>
  );
}
