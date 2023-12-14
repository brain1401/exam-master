import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ProblemSetsPage from "../components/ProblemSets/ProblemSetsPage";

export default async function ExamPage() {
  const session = await getServerSession();

  if (!session) return <LoginRequired />;

  return <ProblemSetsPage type="exam" />;
}