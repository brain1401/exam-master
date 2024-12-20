import ResultPage from "@/components/result/ResultPage";
import LoginRequired from "@/components/ui/LoginRequired";
import ProblemNotFound from "@/components/ui/ProblemNotFound";
import ProblemSetAccessDenied from "@/components/ui/ProblemSetAccessDenied";
import ProblemSetNotFound from "@/components/ui/ProblemSetNotFound";
import JotaiProvider from "@/context/JotaiContext";
import {
  checkUserPermissionForResults,
  getExamResultsByUUID,
} from "@/service/problems";
import { isValidUUID } from "@/utils/problems";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

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

  if (!isValidUUID(UUID)) {
    return {
      title: "시험 결과가 존재하지 않습니다.",
      description: "시험 결과가 존재하지 않습니다.",
    };
  }
  const session = await getServerSession();

  if (session?.user?.email) {
    const data = await getExamResultsByUUID(UUID, session?.user?.email);

    if (!data)
      return {
        title: "시험 결과가 존재하지 않습니다.",
        description: "시험 결과가 존재하지 않습니다.",
      };

    return {
      title: `${data.problemSetName} 시험 결과`,
      description: `시험 결과입니다.`,
    };
  }

  return {
    title: "시험 결과",
    description: "시험 결과가 존재하지 않습니다.",
  };
}

export default async function page(props: Props) {
  const params = await props.params;

  const {
    UUID
  } = params;

  if (!isValidUUID(UUID)) {
    // 에러 페이지로 리다이렉트 필요
    return <div>시험 결과가 존재하지 않습니다.</div>;
  }

  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }

  const UUIDValidate = isValidUUID(UUID);

  if (!UUIDValidate) {
    return <ProblemSetNotFound />;
  }

  const authorized = await checkUserPermissionForResults(
    UUID,
    session?.user?.email,
  );

  if (authorized === "NO") {
    return <ProblemSetAccessDenied />;
  }

  const userEmail = session.user.email;

  const result = await getExamResultsByUUID(UUID, userEmail);

  if (!result) {
    // 에러 페이지로 리다이렉트 필요
    return <ProblemNotFound />;
  }

  return (
    <JotaiProvider>
      <ResultPage _examResultsSet={result} />
    </JotaiProvider>
  );
}
