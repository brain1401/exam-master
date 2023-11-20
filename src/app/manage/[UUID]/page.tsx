import ManageProblemsByUUID from "@/app/components/ManageProblems/ManageProblemsByUUID";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function ManageProblem({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session) {
    return <h1 className="text-2xl text-center mt-10">로그인이 필요합니다.</h1>;
  }
  return <ManageProblemsByUUID UUID={UUID} />;
}
