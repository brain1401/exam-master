import PublicProblemExam from "@/app/components/publicProblem/PublicProblemExam";
import {
  getPublicProblemLikes,
  getPublicProblemSetByUUID,
  getPublicProblemSetComments,
} from "@/service/problems";
import { getUserUUIDbyEmail } from "@/service/user";
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

export const dynamic = "force-dynamic";

export default async function ProblemPage({ params: { UUID } }: Props) {
  const [session] = await Promise.all([getServerSession()]);

  const queryClient = new QueryClient();

  const [userUUID] = await Promise.all([
    session?.user?.email ? await getUserUUIDbyEmail(session.user.email) : null,
    queryClient.prefetchQuery({
      queryKey: ["publicProblemLikes", UUID, session?.user?.email],
      queryFn: () => getPublicProblemLikes(UUID, session?.user?.email),
    }),
    queryClient.prefetchQuery({
      queryKey: ["problemSetComments", UUID],
      queryFn: () => getPublicProblemSetComments(UUID),
    }),
    queryClient.prefetchQuery({
      queryKey: ["publicProblemSet", UUID],
      queryFn: () => getPublicProblemSetByUUID(UUID),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicProblemExam
        publicSetUUID={UUID}
        userEmail={session?.user?.email}
        userName={session?.user?.name}
        userUUID={userUUID}
      />
    </HydrationBoundary>
  );
}
