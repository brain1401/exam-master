import { getServerSession } from "next-auth";
import CreateProblems from "../components/CreateProblems/CreateProblems";

export default async function CreatePage() {
  const session = await getServerSession();

  if (!session) {
    return (
      <>
        <h1>로그인을 해주세요!</h1>
      </>
    );
  }

  return (
    <>
      <CreateProblems />
    </>
  );
}
