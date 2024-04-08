import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { ExamProblemSet } from "@/types/problems";
import { useState } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { isExamProblemAnswered } from "@/utils/problems";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  problemSet: ExamProblemSet | null;
  className?: string;
};

export default function ExamSubmitButton({ problemSet, className }: Props) {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { revalidateAllPathAndRedirect } = useRevalidation();

  const isUserLoggedIn = session ? true : false;

  const ProblemSetName = problemSet?.name;
  const problems = problemSet?.problems;

  const isAllProblemAnswered = problems?.every(isExamProblemAnswered);

  const apiURL = isUserLoggedIn
    ? "/api/evaluateExamProblems"
    : "/api/evaluatePublicExamProblems";

  const body = isUserLoggedIn
    ? {
        examProblems: problems,
        examProblemSetName: ProblemSetName,
      }
    : {
        publicExamProblems: problems,
        publicExamProblemSetName: ProblemSetName,
      };

  const onClick = async () => {
    console.log("problems :", problems);

    setIsLoading(true);

    try {
      const { data } = await axios.post(apiURL, body);
      const uuid = data.uuid;

      const directURL = isUserLoggedIn
        ? `/result/${uuid}`
        : `/public-problem/result/${uuid}`;

      // // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화 및 결과 페이지로 리다이렉트
      revalidateAllPathAndRedirect(directURL);
      console.log("uuid :", uuid);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(`mt-3 w-[6.5rem] px-6`, className)}
            isLoading={isLoading}
          >
            {isLoading ? "채점중..." : "제출하기"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시험 제출</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription>
            {isAllProblemAnswered
              ? "시험을 제출하시겠습니까? 제출 후에는 시험 결과를 확인할 수 있습니다."
              : "모든 문제를 풀지 않았습니다. 제출하시겠습니까? 제출 후에는 시험 결과를 확인할 수 있습니다."}
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={onClick} disabled={isLoading}>
              제출
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
