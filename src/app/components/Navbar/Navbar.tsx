import LoginButton from "../ui/LoginButton";
import NavMobile from "./NavMobile";
import NavBackDrop from "./NavBackDrop";
import PCNavbar from "./PCNavbar";
import { getServerSession } from "next-auth";
import MediaQuery from "./MediaQuery";

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
      <MediaQuery />
      <PCNavbar loginButton={loginButton} />
    </header>
  );
}
