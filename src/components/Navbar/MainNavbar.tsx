import LoginButton from "../ui/LoginButton";
import MobileNavSlide from "./MobileNavSlide";
import NavBackDrop from "./NavBackDrop";
import Navbar from "./Navbar";
import { getServerSession } from "next-auth";
import MediaQuery from "./MediaQuery";

export default async function MainNavbar() {
  const session = await getServerSession();

  const loginButton = session ? (
    <LoginButton type="logout" />
  ) : (
    <LoginButton type="login" />
  );

  return (
    <header>
      <MobileNavSlide loginButton={loginButton} />
      <NavBackDrop />
      <MediaQuery />
      <Navbar loginButton={loginButton} />
    </header>
  );
}
