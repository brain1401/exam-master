import LoginButton from "./ui/LoginButton";
import { getServerSession } from "next-auth";
import NavMobile from "./Navbar/NavMobile";
import NavBackDrop from "./Navbar/NavBackDrop";
import PCNavbar from "./Navbar/PCNavbar";

export default async function Navbar() {
  const session  = await getServerSession();
 

  const loginButton = session ? (
    <LoginButton type="logout" />
  ) : (
    <LoginButton type="login" />
  );


  return (
    <>
    <NavMobile loginButton={loginButton} />
    <NavBackDrop/>
    <PCNavbar loginButton={loginButton} />

      
    </>
  );
}
