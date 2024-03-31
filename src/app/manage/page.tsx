import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ProblemSetsPage from "../components/ProblemSets/ProblemSetsPage";
import type { Metadata } from "next";
import { getProblemSets, getProblemSetsMaxPage } from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "문제 관리",
  description: "문제를 관리하세요.",
};

export default async function ManagePage() {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return <LoginRequired />;
  }
  const userEmail = session.user.email;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["problemSets", 1, 8, false, "", null, userEmail],
    queryFn: () => getProblemSets(userEmail, "1", "8"),
  });

  const userUUID = await getUserUUIDbyEmail(userEmail);
  const maxPage = await getProblemSetsMaxPage(false, "", 8, userUUID);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProblemSetsPage
        type="manage"
        userEmail={userEmail}
        maxPage={maxPage ?? 1}
      />
    </HydrationBoundary>
  );
}
