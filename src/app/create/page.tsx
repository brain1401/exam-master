import { getServerSession } from "next-auth";
import CreateProblems from "@/components/CreateProblems/CreateProblems";
import LoginRequired from "@/components/ui/LoginRequired";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문제 생성",
  description: "문제를 생성하세요.",
};

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
