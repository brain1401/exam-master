import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ProblemSetsPage from "../components/ProblemSets/ProblemSetsPage";
import type { Metadata } from "next";
import { getProblemSetsMaxPage } from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";

export const metadata: Metadata = {
  title: "문제 관리",
  description: "문제를 관리하세요.",
};

export default async function ManagePage() {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return <LoginRequired />;
  }

  const userUUID = await getUserUUIDbyEmail(session.user.email);
  const maxPage = await getProblemSetsMaxPage(false, "", 8, userUUID);
  return (
    <ProblemSetsPage
      type="manage"
      userEmail={session.user.email}
      maxPage={maxPage ?? 1}
    />
  );
}
