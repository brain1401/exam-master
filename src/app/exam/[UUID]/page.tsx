import ExamProblems from "@/app/components/ExamProblems/ExamProblems";
import LoginRequired from "@/app/components/ui/LoginRequired";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function DetailedExamPage({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }

  return <ExamProblems UUID={UUID} />;
}
