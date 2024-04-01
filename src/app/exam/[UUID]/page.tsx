import ExamProblems from "@/components/ExamProblems/ExamProblems";
import LoginRequired from "@/components/ui/LoginRequired";
import {
  checkUserPermissionForProblemSet,
  getExamProblemsByProblemSetUUID,
  getProblemsSetByUUID,
} from "@/service/problems";
import { uuidSchema } from "@/types/problems";
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
    const isUUIDValidated = uuidSchema.safeParse(UUID);
    if (!isUUIDValidated.success) {
      return {
        title: "시험 문제",
        description: "시험 문제를 풀어보세요.",
      };
    }

    const data = await getProblemsSetByUUID(UUID, session?.user?.email);

    return {
      title: `${data.name} 문제 풀기`,
      description: data.description || "",
    };
  }

  return {
    title: "시험 문제",
    description: "시험 문제를 풀어보세요.",
  };
}

export default async function DetailedExamPage({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }

  const isUUIDValidated = uuidSchema.safeParse(UUID);
  if (!isUUIDValidated.success) {
    return <div>문제 세트 UUID가 올바르지 않습니다.</div>;
  }

  const validateResult = await checkUserPermissionForProblemSet(
    UUID,
    session.user.email,
  );

  if (validateResult === "NO") {
    return <div>본인의 문제만 가져올 수 있습니다.</div>;
  }

  const examProblemSet = await getExamProblemsByProblemSetUUID(
    UUID,
    session.user.email,
  );

  return <ExamProblems examProblemSet={examProblemSet} />;
}
