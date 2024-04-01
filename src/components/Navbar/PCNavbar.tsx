"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/Exam Master.svg";
import { HiMenu } from "react-icons/hi";
import useIsMobileNavMenuOpen from "@/hooks/useIsMobileNavMenuOpen";

const LIST_ITEM =
  "hidden md:flex text-md font-bold items-center justify-center list-none";

type Props = {
  loginButton: JSX.Element;
};

export default function PCNavbar({ loginButton }: Props) {
  const { toggleMobileMenu } = useIsMobileNavMenuOpen();

  return (
    <nav // navbar
      className="transparent z-30 flex w-full border-b border-gray-300 bg-main"
    >
      <div className="flex w-full items-center justify-between md:gap-3">
        <div className="flex">
          <div className="ml-[1rem] px-5 py-2 text-xl font-bold md:ml-[3rem] md:text-2xl">
            <Link href="/">
              <Image src={logo} alt="logo" className="h-[2rem] w-[8rem]" />
            </Link>
          </div>
          <ul className="flex items-center gap-3">
            <li className={LIST_ITEM}>
              <Link href="/exam">문제 풀기</Link>
            </li>
            <li className={LIST_ITEM}>
              <Link href="/manage">문제 관리</Link>
            </li>
            <li className={LIST_ITEM}>
              <Link href="/create">문제 생성</Link>
            </li>
            <li className={LIST_ITEM}>
              <Link href="/results">시험 결과</Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:mr-[10vw] md:block ">
          <div className="flex h-full w-full items-center justify-center">
            {loginButton}
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={() => toggleMobileMenu()}>
            <HiMenu className="absolute right-5 top-[0.5rem] text-[1.9rem]" />
          </button>
        </div>
      </div>
    </nav>
  );
}
