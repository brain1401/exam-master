"use client";
import type { ExamProblemSet } from "@/types/problems";
import { useEffect } from "react";
import PublicProblemMainPage from "./PublicProblemMainPage";
import { useHydrateAtoms } from "jotai/utils";
import {
  publicExamProblemsAtom,
  timeLimitAtom,
  publicExamProblemSetAtom,
} from "@/jotai/publicProblemExam";
import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";

type Props = {
  publicSetUUID: string;
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userUUID: string | null | undefined;
  publicProblemSet: ExamProblemSet | null;
};

export type Like = { likes: number; liked: boolean };

export default function PublicProblemExam({
  publicSetUUID,
  userEmail,
  userUUID,
  publicProblemSet,
}: Props) {
  // 해당 컴포넌트 첫 렌더링 시 초기 html렌더링 및 seo를 위해 관련 atom 값 Hydrate
  useHydrateAtoms([
    [timeLimitAtom, publicProblemSet?.timeLimit?.toString() || "0"],
    [publicExamProblemsAtom, publicProblemSet?.problems ?? []],
    [publicExamProblemSetAtom, publicProblemSet],
  ]);

  const {
    currentExamProblemIndex,
    currentPublicExamProblem,
    publicExamProblems,
    setCurrentExamProblemIndex,
    setIsRandomSelected,
    setIsTimeOver,
    setTimeLimit,
    setPublicExamProblemSet,
    setPublicExamProblems,
  } = usePublicProblemExam();

  useEffect(() => {
    console.log("publicProblemSet :", currentExamProblemIndex);
  }, [currentExamProblemIndex]);

  useEffect(() => {
    console.log("currentPublicExamProblem :", currentPublicExamProblem);
  }, [currentPublicExamProblem]);

  useEffect(() => {
    console.log("publicExamProblems :", publicExamProblems);
  }, [publicExamProblems]);

  // 첫 렌더링이 아닐 시 useEffect로 관련 상태를 업데이트
  useEffect(() => {
    if (publicProblemSet) {
      setTimeLimit(publicProblemSet.timeLimit?.toString() || "0");
      setPublicExamProblemSet(publicProblemSet);
      setCurrentExamProblemIndex(0);
      setPublicExamProblems(publicProblemSet.problems);
      setIsRandomSelected(false);
      setIsTimeOver(false);
    }
  }, [
    publicProblemSet,
    setTimeLimit,
    setPublicExamProblemSet,
    setCurrentExamProblemIndex,
    setPublicExamProblems,
    setIsRandomSelected,
    setIsTimeOver,
  ]);

  return (
    <PublicProblemMainPage
      publicSetUUID={publicSetUUID}
      userEmail={userEmail}
      userUUID={userUUID}
    />
  );
}
