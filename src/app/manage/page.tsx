import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";

export default async function ManagePage() {
  const session = await getServerSession();

  return (
    <>
      {session ? (
        <section className="p-3 max-w-[80rem] mx-auto">
          <h1>문제집 관리</h1>
            <ProblemSetGrid />
        </section>
      ) : (
        <h1>로그인이 필요합니다.</h1>
      )}
    </>
  );
}
