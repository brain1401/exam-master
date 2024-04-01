import ManageProblemsByUUID from "@/components/ManageProblems/ManageProblemsByUUID";
import LoginRequired from "@/components/ui/LoginRequired";
import { getProblemsSetByUUID } from "@/service/problems";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import JotaiProvider from "@/context/JotaiContext";
import { revalidatePath } from "next/cache";
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

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }

  const problemSet = await getProblemsSetByUUID(UUID, session?.user?.email);

  return (
    <JotaiProvider>
      <ManageProblemsByUUID UUID={UUID} problemSet={problemSet} />
    </JotaiProvider>
  );
}
