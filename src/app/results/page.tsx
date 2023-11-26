import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import Results from "../components/Results/ResultsPage";

export default async function ResultsPage() {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }

  return <Results />;
}
