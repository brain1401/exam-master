import ExamProblems from "@/app/components/ExamProblems/ExamProblems";
import LoginRequired from "@/app/components/ui/LoginRequired";
import { getProblemsSetByUUID } from "@/service/problems";
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

  if (!session) {
    return <LoginRequired />;
  }

  return <ExamProblems UUID={UUID} />;
}
