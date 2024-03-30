import ResultPage from "@/app/components/result/ResultPage";
import LoginRequired from "@/app/components/ui/LoginRequired";
import { getExamResultsByUUID } from "@/service/problems";
import { Metadata } from "next";
import { getServerSession } from "next-auth";


type Props = {
  params: {
    UUID: string;
  };
};

export async function generateMetadata({
  params: { UUID },
}: Props): Promise<Metadata> {
  const session = await getServerSession();

  if (session?.user?.email) {
    const data = await getExamResultsByUUID(UUID, session?.user?.email);

    return {
      title: `${data.problemSetName} 시험 결과`,
    };
  }

  return {
    title: "시험 결과",
  };
}


export default async function page({ params: { UUID } }: Props) {
  const session = await getServerSession();


  if (!session) {
    return <LoginRequired />
  }

  return <ResultPage UUID={UUID} />;
}
