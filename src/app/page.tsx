import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      {session ? (
        <h1>환영합니다. {`${session.user?.email}님!`}</h1>
      ) : (
        <h1>로그인이 필요합니다.</h1>
      )}
    </>
  );
}
