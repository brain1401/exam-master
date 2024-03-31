import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ProblemSetsPage from "../components/ProblemSets/ProblemSetsPage";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getProblemSets, getProblemSetsMaxPage } from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";

export const metadata: Metadata = {
  title: "문제 풀기",
  description: "문제를 풀어보세요.",
};

export default async function ExamPage() {
  const session = await getServerSession();
  if (!session || !session.user?.email) return <LoginRequired />;

  const userEmail = session.user.email;
  const userUUID = await getUserUUIDbyEmail(userEmail);
  const queryClient = new QueryClient();

  const [, maxPage] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["problemSets", 1, 8, false, "", null, userEmail],
      queryFn: () => getProblemSets(userEmail, "1", "8"),
    }),
    getProblemSetsMaxPage(false, "", 8, userUUID),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProblemSetsPage
        type="exam"
        userEmail={userEmail}
        maxPage={maxPage ?? 1}
      />
      ;
    </HydrationBoundary>
  );
}
