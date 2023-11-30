import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";
import LoginRequired from "../components/ui/LoginRequired";

export default async function ExamPage() {
  const session = await getServerSession();

  if (!session) return <LoginRequired />;

  return (
    <section className="mx-auto mt-10 h-full max-w-[80rem]">
      <h1 className="text-center text-3xl">풀 문제 선택</h1>
      <ProblemSetGrid type="exam" />
    </section>
  );
}
