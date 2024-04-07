import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { PublicExamProblemSet } from "@/types/problems";
import { useState } from "react";
import useRevalidation from "@/hooks/useRevalidate";
import { isExamProblemAnswered } from "@/utils/problems";
import axios from "axios";

type Props = {
  ProblemSet: PublicExamProblemSet | null;
};

export default function ExamSubmitButton({ ProblemSet }: Props) {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const { revalidateAllPathAndRedirect } = useRevalidation();

  const user = session?.user;

  const userEmail = user?.email;
  const userName = user?.name;

  const problems = ProblemSet?.problems;

  const onClick = async () => {

    console.log("problems :",problems);
    if (!problems?.every(isExamProblemAnswered)) {
      return alert("모든 문제에 답을 입력해주세요.");
    }

    setIsLoading(true);
    let uuid = "";

    try {
      const { data } = await axios.post("/api/evaluatePublicExamProblems", {
        examProblems: problems,
        publicProblemSetUuid: ProblemSet?.uuid,
      });
      uuid = data.uuid;

      // // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화 및 결과 페이지로 리다이렉트
      //   await revalidateAllPathAndRedirect(`/result/${uuid}`);

      console.log("uuid :",uuid);
      
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
      className="mt-3 w-[6.5rem] px-6"
      onClick={onClick}
      isLoading={isLoading}
    >
      {isLoading ? "채점중..." : "제출하기"}
    </Button>
  );
}
