import ManageProblemsByUUID from "@/app/components/ManageProblems/ManageProblemsByUUID";
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
      title: `${data.name} 문제집 관리`,
      description: data.description || "",
    };
  }

  return {
    title: "문제집 관리",
    description: "문제집을 관리하세요.",
  };
}

export default async function ManageProblem({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }
  return <ManageProblemsByUUID UUID={UUID} />;
}
