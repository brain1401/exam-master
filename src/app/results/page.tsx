import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ResultsPage from "../components/Results/ResultsPage";

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
