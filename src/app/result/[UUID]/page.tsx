import ResultPage from "@/app/components/result/ResultPage";
import LoginRequired from "@/app/components/ui/LoginRequired";
import { getServerSession } from "next-auth";


type Props = {
  params: {
    UUID: string;
  };
};

export default async function page({ params: { UUID } }: Props) {
  const session = await getServerSession();


  if (!session) {
    return <LoginRequired />
  }

  return <ResultPage UUID={UUID} />;
}
