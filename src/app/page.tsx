import { getServerSession } from "next-auth/next";
import LoginRequired from "./components/ui/LoginRequired";
import Announcements from "./components/ui/Announcements";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    return <LoginRequired />;
  }
  return (
    <>
      <h1 className="mt-10 text-center text-2xl">{`환영합니다! ${session.user?.name}님!`}</h1>
      <Announcements />
    </>
  );
}
