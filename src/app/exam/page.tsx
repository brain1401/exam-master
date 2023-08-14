import { getServerSession } from "next-auth";

export default async function ExamPage() {
  const session = await getServerSession();

  return (
    <>{session ? <div>Exam Page</div> : <div>로그인이 필요합니다.</div>}</>
  );
}
