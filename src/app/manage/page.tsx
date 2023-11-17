import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";

export default async function ManagePage() {
  const session = await getServerSession();

  return (
    <>
      {session ? (
        <section className="mx-auto h-full max-w-[80rem] p-3">
          <h1 className="mt-10 text-center text-3xl">관리할 문제 선택</h1>
          <ProblemSetGrid type="manage" />
        </section>
      ) : (
        <h1>로그인이 필요합니다.</h1>
      )}
    </>
  );
}
