import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { ExamProblemSet } from "@/types/problems";
import { useState } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { isExamProblemAnswered } from "@/utils/problems";
import axios from "axios";
import { cn } from "@/lib/utils";

type Props = {
  problemSet: ExamProblemSet | null;
  className?: string;
};

export default function ExamSubmitButton({ problemSet, className }: Props) {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const { revalidateAllPathAndRedirect } = useRevalidation();

  const isUserLoggedIn = session ? true : false;

  const ProblemSetUUID = problemSet?.uuid;
  const problems = problemSet?.problems;

  const apiURL = isUserLoggedIn
    ? "/api/evaluateExamProblems"
    : "/api/evaluatePublicExamProblems";

  const body = isUserLoggedIn
    ? {
        examProblems: problems,
        examProblemSetUUID: ProblemSetUUID,
      }
    : {
        publicExamProblems: problems,
        publicExamProblemSetUuid: ProblemSetUUID,
      };

  const onClick = async () => {
    console.log("problems :", problems);
    if (!problems?.every(isExamProblemAnswered)) {
      return alert("모든 문제에 답을 입력해주세요.");
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(apiURL, body);
      const uuid = data.uuid;

      const directURL = isUserLoggedIn
        ? `/result/${uuid}`
        : `/public-problem/result/${uuid}`;

      // // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화 및 결과 페이지로 리다이렉트
      await revalidateAllPathAndRedirect(directURL);
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
    <Button
      className={cn(`mt-3 w-[6.5rem] px-6`, className)}
      onClick={onClick}
      isLoading={isLoading}
    >
      {isLoading ? "채점중..." : "제출하기"}
    </Button>
  );
}
