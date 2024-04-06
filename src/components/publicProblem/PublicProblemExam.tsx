"use client";
import type { PublicExamProblemSet } from "@/types/problems";
import { useEffect } from "react";
import PublicProblemMainPage from "./PublicProblemMainPage";
import { useHydrateAtoms } from "jotai/utils";
import {
  isExamStartedAtom,
  publicExamProblemsAtom,
  timeLimitAtom,
  publicExamProblemSetAtom,
} from "@/jotai/publicProblemExam";
import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import PublicProblemExamPage from "./PublicProblemExamPage";

type Props = {
  publicSetUUID: string;
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userUUID: string | null | undefined;
  publicProblemSet: PublicExamProblemSet | null;
};

export type Like = { likes: number; liked: boolean };

export default function PublicProblemExam({
  publicSetUUID,
  userEmail,
  userName,
  userUUID,
  publicProblemSet,
}: Props) {
  useHydrateAtoms([
    [timeLimitAtom, publicProblemSet?.timeLimit.toString() || "20"],
    [isExamStartedAtom, false],
    [publicExamProblemsAtom, publicProblemSet?.problems || []],
    [publicExamProblemSetAtom, publicProblemSet],
  ]);

  const { isExamStarted } = usePublicProblemExam();

  return (
    <div className="px-3 py-3 pt-10">
      {isExamStarted ? (
        <PublicProblemExamPage
          publicProblemSet={publicProblemSet}
          problemSetTimeLimit={publicProblemSet?.timeLimit || 20}
        />
      ) : (
        <PublicProblemMainPage
          publicSetUUID={publicSetUUID}
          userEmail={userEmail}
          userName={userName}
          userUUID={userUUID}
        />
      )}
    </div>
  );
}
