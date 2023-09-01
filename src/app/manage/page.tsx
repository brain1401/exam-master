import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";
import { Suspense } from "react";
import ClientClipLoader from "../components/ui/ClientClipLoader";

export default async function ManagePage() {
  const session = await getServerSession();

  return (
    <>
      {session ? (
        <section className="p-3 max-w-[80rem] mx-auto">
          <h1>문제집 관리</h1>

          <Suspense
            fallback={
              <div className="w-full flex justify-center items-center">
                <ClientClipLoader size={50}/>
              </div>
            }
          >
            <ProblemSetGrid />
          </Suspense>
        </section>
      ) : (
        <h1>로그인이 필요합니다.</h1>
      )}
    </>
  );
}
