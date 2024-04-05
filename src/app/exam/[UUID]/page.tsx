import ExamProblems from "@/components/ExamProblems/ExamProblems";
import LoginRequired from "@/components/ui/LoginRequired";
import ProblemSetAccessDenied from "@/components/ui/ProblemSetAccessDenied";
import ProblemSetNotFound from "@/components/ui/ProblemSetNotFound";
import JotaiProvider from "@/context/JotaiContext";
import {
  checkUserPermissionForProblemSet,
  getExamProblemsByProblemSetUUID,
  getProblemsSetByUUID,
} from "@/service/problems";
import { isValidUUID } from "@/utils/problems";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export async function generateMetadata({
  params: { UUID },
}: Props): Promise<Metadata> {
  const session = await getServerSession();

  if (session?.user?.email) {
    if (!isValidUUID(UUID)) {
      return {
        title: "시험 문제",
        description: "시험 문제를 풀어보세요.",
      };
    }

    const data = await getProblemsSetByUUID(UUID, session?.user?.email);

    if (!data) {
      return {
        title: "시험 문제를 찾을 수 없습니다.",
        description: "시험 문제를 찾을 수 없습니다.",
      };
    }
    return {
      title: `${data.name} 문제 풀기`,
      description: data.description || "",
    };
  }

  return {
    title: "시험 문제를 찾을 수 없습니다.",
    description: "시험 문제를 찾을 수 없습니다.",
  };
}

export default async function DetailedExamPage({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }

   const UUIDValidate = isValidUUID(UUID);

   if (!UUIDValidate) {
     return <ProblemSetNotFound />;
   }

   const authorized = await checkUserPermissionForProblemSet(
     UUID,
     session?.user?.email,
   );

   if (authorized === "NO") {
     return <ProblemSetAccessDenied />;
   }


  const examProblemSet = await getExamProblemsByProblemSetUUID(
    UUID,
    session.user.email,
  );

  if (!examProblemSet) {
    // 에러 페이지로 리다이렉트 필요
    return <div>문제 세트를 찾을 수 없습니다.</div>;
  }

  return (
    <JotaiProvider>
      <ExamProblems examProblemSet={examProblemSet} />
    </JotaiProvider>
  );
}
