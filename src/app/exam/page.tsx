import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";

export default async function ExamPage() {
  const session = await getServerSession();

  if (!session) return <div>로그인이 필요합니다.</div>;
  return (
    <section className="mx-auto mt-10 max-w-[80rem] h-full p-3">
      <h1 className="text-center text-3xl">풀 문제 선택</h1>
      <ProblemSetGrid type="exam" />
    </section>
  );
}
