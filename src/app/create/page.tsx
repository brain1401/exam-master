import { getServerSession } from "next-auth";

export default async function CreatePage() {
  const session = await getServerSession();

  return (
    <>{session ? <div>Create Page</div> : <div>로그인이 필요합니다.</div>}</>
  );
}
