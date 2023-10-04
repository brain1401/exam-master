import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";

export default async function ExamPage() {
  const session = await getServerSession();

  return (
    <>{session ? <ProblemSetGrid type="exam"/> : <div>로그인이 필요합니다.</div>}</>
  );
}
