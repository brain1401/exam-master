import ManageProblemsByUUID from "@/app/components/ManageProblems/ManageProblemsByUUID";
import LoginRequired from "@/app/components/ui/LoginRequired";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    UUID: string;
  };
};

export default async function ManageProblem({ params: { UUID } }: Props) {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }
  return <ManageProblemsByUUID UUID={UUID} />;
}
