import { getServerSession } from "next-auth";
import LoginRequired from "../components/ui/LoginRequired";
import ProblemSetsPage from "../components/ProblemSets/ProblemSetsPage";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getProblemSets } from "@/service/problems";

export const metadata: Metadata = {
  title: "문제 풀기",
  description: "문제를 풀어보세요.",
};

export default async function ExamPage() {
  const session = await getServerSession();
  if (!session || !session.user?.email) return <LoginRequired />;

  const userEmail = session.user.email;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["problemSets", 1, 8, false, "", null, userEmail],
      queryFn: () => getProblemSets(userEmail, "1", "8"),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProblemSetsPage type="exam" userEmail={userEmail}/>;
    </HydrationBoundary>
  );
}
