import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";
import LoginRequired from "../components/ui/LoginRequired";

export default async function ManagePage() {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }

  return <ProblemSetGrid type="manage" />;
}
