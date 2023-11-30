import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";
import LoginRequired from "../components/ui/LoginRequired";

export default async function ManagePage() {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }

  return (
    <>
      <section className="mx-auto max-w-[80rem]">
        <h1 className="mt-10 text-center text-3xl">관리할 문제 선택</h1>
        <ProblemSetGrid type="manage" />
      </section>
    </>
  );
}
