import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import {
  fetchPublicProblemLikes,
  fetchPublicProblemSetByUUID,
  fetchPublicProblemSetComments,
} from "@/utils/problems";
import { ProblemSetComment, ExamProblemSet } from "@/types/problems";
import { Like } from "./PublicProblemExam";
import axios from "axios";
import { handleEnterKeyPress } from "@/utils/keyboard";
import { TrashIcon } from "lucide-react";
import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import ExamProblemCard from "./ExamProblemCard";
import ExamComments from "./ExamComments";

type Props = {
  publicSetUUID: string;
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userUUID: string | null | undefined;
};

export default function PublicProblemMainPage({
  publicSetUUID,
  userEmail,
  userName,
  userUUID,
}: Props) {
  const {
    timeLimit,
    setTimeLimit,
    setIsExamStarted,
    isRandomSelected,
    setIsRandomSelected,
    setPublicExamProblemsRandom,
    setPublicExamProblemsOriginal,
  } = usePublicProblemExam();
  const { revalidateAllPath } = useRevalidation();

  const { data: publicProblemSet } = useQuery<ExamProblemSet | null>({
    queryKey: ["publicProblemSet", publicSetUUID],
    queryFn: () => fetchPublicProblemSetByUUID(publicSetUUID),
  });

  const { data: comments } = useQuery<ProblemSetComment[] | null>({
    queryKey: ["problemSetComments", publicSetUUID],
    queryFn: () => fetchPublicProblemSetComments(publicSetUUID),
  });

  const { data: like } = useQuery<Like | null>({
    queryKey: ["publicProblemLikes", publicSetUUID, userEmail],
    queryFn: () => fetchPublicProblemLikes(publicSetUUID),
  });


  useEffect(() => {
    if (isRandomSelected) {
      setPublicExamProblemsRandom();
    } else {
      setPublicExamProblemsOriginal();
    }
  }, [
    isRandomSelected,
    setPublicExamProblemsRandom,
    setPublicExamProblemsOriginal,
  ]);

  useEffect(() => {
    console.log("timeLimit :", timeLimit);
  }, [timeLimit]);

  // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
  useEffect(() => {
    revalidateAllPath();
  }, [revalidateAllPath]);

  useEffect(() => {
    console.log(like);
  }, [like]);

  return (
    <div className="mx-auto w-full max-w-[50rem] px-[1.5rem] pt-[6rem]">
      <ExamProblemCard
        isRandomSelected={isRandomSelected}
        setIsRandomSelected={setIsRandomSelected}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        setIsExamStarted={setIsExamStarted}
        problemSet={publicProblemSet ?? ({} as ExamProblemSet)}
        problemSetUUID={publicSetUUID}
        userUUID={userUUID}
        like={like ?? ({ likes: 0, liked: false } as Like)}
      />

      <ExamComments
        comments={comments ?? []}
        publicSetUUID={publicSetUUID}
        userUUID={userUUID}
      />
    </div>
  );
}