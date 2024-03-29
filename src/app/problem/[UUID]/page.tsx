import PublicProblemExam from "@/app/components/publicProblem/PublicProblemExam";
import {
  getPublicProblemLikes,
  getPublicProblemSetByUUID,
  getPublicProblemSetComments,
} from "@/service/problems";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function ProblemPage({ params: { UUID } }: Props) {
  const [publicProblemSet, session] = await Promise.all([
    getPublicProblemSetByUUID(UUID),
    getServerSession(),
  ]);

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["publicProblemLikes", UUID, session?.user?.email],
      queryFn: () => getPublicProblemLikes(UUID, session?.user?.email),
    }),
    queryClient.prefetchQuery({
      queryKey: ["problemSetComments", UUID],
      queryFn: () => getPublicProblemSetComments(UUID),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicProblemExam
        publicProblemSet={publicProblemSet}
        userEmail={session?.user?.email}
        userName={session?.user?.name}
      />
    </HydrationBoundary>
  );
}
