import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ProblemSetsPage from "../components/ProblemSets/ProblemSetsPage";
import type { Metadata } from "next";

  export const metadata: Metadata = {
    title: "문제 풀기",
    description: "문제를 풀어보세요.",
  };

export default async function ExamPage() {
  const session = await getServerSession();

  if (!session) return <LoginRequired />;


  return <ProblemSetsPage type="exam"/>;
}