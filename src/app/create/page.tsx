import { getServerSession } from "next-auth";
import CreateProblems from "../components/CreateProblems/CreateProblems";
import LoginRequired from "../components/ui/LoginRequired";

export default async function CreatePage() {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }

  return (
    <>
      <CreateProblems />
    </>
  );
}
