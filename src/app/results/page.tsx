import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ResultsPage from "@/app/components/results/ResultsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "시험 결과",
  description: "결과를 확인하세요.",
};


export default async function Results() {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }

  return (
    <>
      <ResultsPage />
    </>
  );
}
