import { getServerSession } from "next-auth";
import ProblemSetGrid from "../components/ProblemSetGrid";

export default async function ManagePage() {
  const session = await getServerSession();

  return (<>{
    session ? <ProblemSetGrid/> : <h1>로그인이 필요합니다.</h1>
    }</>);
}
