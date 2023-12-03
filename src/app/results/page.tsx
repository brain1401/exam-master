import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ResultsPage from "@/app/components/results/ResultsPage";

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
