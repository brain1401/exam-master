import ExamProblems from "@/app/components/ExamProblems/ExamProblems";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function DetailedExamPage({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session) {
    return <h1 className="mt-10 text-center text-2xl">로그인이 필요합니다.</h1>;
  }

  return <ExamProblems UUID={UUID} />;
}
