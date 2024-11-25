import ManageProblemsByUUID from "@/components/ManageProblems/ManageProblemsByUUID";
import LoginRequired from "@/components/ui/LoginRequired";
import {
  checkUserPermissionForProblemSet,
  getProblemsSetByUUID,
} from "@/service/problems";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import JotaiProvider from "@/context/JotaiContext";
import { isValidUUID } from "@/utils/problems";
import ProblemSetAccessDenied from "@/components/ui/ProblemSetAccessDenied";
import ProblemSetNotFound from "@/components/ui/ProblemSetNotFound";
type Props = {
  params: Promise<{
    UUID: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    UUID
  } = params;

  const session = await getServerSession();

  if (session?.user?.email) {
    if (!isValidUUID(UUID)) {
      return {
        title: "해당하는 문제집이 없습니다.",
        description: "해당하는 문제집이 없습니다",
      };
    }

    const data = await getProblemsSetByUUID(UUID, session?.user?.email);

    if (!data) {
      return {
        title: "해당하는 문제집이 없습니다.",
        description: "해당하는 문제집이 없습니다",
      };
    }

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

export default async function ManageProblem(props: Props) {
  const params = await props.params;

  const {
    UUID
  } = params;

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

  const problemSet = await getProblemsSetByUUID(UUID, session?.user?.email);

  if (!problemSet) {
    return <ProblemSetNotFound />;
  }

  return (
    <JotaiProvider>
      <ManageProblemsByUUID UUID={UUID} problemSet={problemSet} />
    </JotaiProvider>
  );
}
