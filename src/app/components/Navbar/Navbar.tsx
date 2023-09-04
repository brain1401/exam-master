import LoginButton from "../ui/LoginButton";
import { getServerSession } from "next-auth";
import NavMobile from "./NavMobile";
import NavBackDrop from "./NavBackDrop";
import PCNavbar from "./PCNavbar";

export default async function Navbar() {
  const session = await getServerSession();

  const loginButton = session ? (
    <LoginButton type="logout" />
  ) : (
    <LoginButton type="login" />
  );

  return (
    <header>
      <NavMobile loginButton={loginButton} />
      <NavBackDrop />
      <PCNavbar loginButton={loginButton} />
    </header>
  );
}
