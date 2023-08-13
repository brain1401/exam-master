"use client";
import { useSession } from "next-auth/react";
import LoginButton from "./ui/LoginButton";
import Link from "next/link";


const BUTTON_CLASSNAME = "text-md font-bold justify-center items-center";

export default function Navbar() {
  const { data: session } = useSession();
  const loginButton = session ? (
    <LoginButton type="logout" />
  ) : (
    <LoginButton type="login" />
  );

  return (
    <nav className="flex justify-between items-center w-full border-b border-gray-300 py-2">
      <ul className="flex gap-5 items-center ml-[10rem]">
        <li>
          <Link href="/" className={"text-2xl font-bold"}>
            Exam Master
          </Link>
        </li>
        <li>
          <Link href="/exam" className={BUTTON_CLASSNAME}>
            문제 만들기
          </Link>
        </li>
        <li>
          <Link href="/exam" className={BUTTON_CLASSNAME}>
            문제 풀기
          </Link>
        </li>
      </ul>
      <div className="mr-[10rem]">{loginButton}</div>
    </nav>
  );
}
