import { Metadata } from "next";
import PublicProblemExam from "@/components/publicProblem/PublicProblemExam";
import {
  checkIfPublicProblemSetExists,
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
import { isValidUUID } from "@/utils/problems";
import ProblemSetNotFound from "@/components/ui/ProblemSetNotFound";

type Props = {
  params: {
    UUID: string;
  };
};

export async function generateMetadata({
  params: { UUID },
}: Props): Promise<Metadata> {
  if (!isValidUUID(UUID)) {
    return {
      title: "문제 세트를 찾을 수 없음",
      description: "찾고 있는 문제 세트가 존재하지 않습니다.",
      openGraph: {
        title: "문제 세트를 찾을 수 없음",
        description: "찾고 있는 문제 세트가 존재하지 않습니다.",
        siteName: "Exam Master",
      },
    };
  }

  const publicProblemSet = await getPublicProblemSetByUUID(UUID);
  if (!publicProblemSet) {
    return {
      title: "문제 세트를 찾을 수 없음",
      description: "찾고 있는 문제 세트가 존재하지 않습니다.",
      openGraph: {
        title: "문제 세트를 찾을 수 없음",
        description: "찾고 있는 문제 세트가 존재하지 않습니다.",
        siteName: "Exam Master",
      },
    };
  }
  return {
    title: `문제집 ${publicProblemSet.name}`,
    description: publicProblemSet.description || "",
    openGraph: {
      title: `문제집 ${publicProblemSet.name}`,
      description: publicProblemSet.description || "",
      siteName: "Exam Master",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProblemPage({ params: { UUID } }: Props) {
  const [session] = await Promise.all([getServerSession()]);

  const queryClient = new QueryClient();

  const exists = await checkIfPublicProblemSetExists(UUID);

  if (!exists) {
    
    return <ProblemSetNotFound />;
  }

  const [userUUID, publicProblemSet] = await Promise.all([
    session?.user?.email ? await getUserUUIDbyEmail(session.user.email) : null,
    getPublicProblemSetByUUID(UUID),
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
        publicProblemSet={publicProblemSet}
      />
    </HydrationBoundary>
  );
}
