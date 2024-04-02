import ResultPage from "@/components/result/ResultPage";
import LoginRequired from "@/components/ui/LoginRequired";
import JotaiProvider from "@/context/JotaiContext";
import { getExamResultsByUUID } from "@/service/problems";
import { isValidUUID } from "@/utils/problems";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export async function generateMetadata({
  params: { UUID },
}: Props): Promise<Metadata> {
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

export default async function page({ params: { UUID } }: Props) {
  if (!isValidUUID(UUID)) {
    // 에러 페이지로 리다이렉트 필요
    return <div>시험 결과가 존재하지 않습니다.</div>;
  }

  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return <LoginRequired />;
  }
  const userEmail = session.user.email;

  const result = await getExamResultsByUUID(UUID, userEmail);

  if (!result) {
    // 에러 페이지로 리다이렉트 필요
    return <div>시험 결과가 존재하지 않습니다.</div>;
  }

  return (
    <JotaiProvider>
      <ResultPage _examResultsSet={result} />
    </JotaiProvider>
  );
}
