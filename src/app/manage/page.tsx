import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";

export default async function ManagePage() {
  const session = await getServerSession();

  return (
    <>
      {session ? (
        <section className="mx-auto max-w-[80rem] p-3">
          <h1>문제집 관리</h1>
          <ProblemSetGrid type="manage" />
        </section>
      ) : (
        <h1>로그인이 필요합니다.</h1>
      )}
    </>
  );
}
