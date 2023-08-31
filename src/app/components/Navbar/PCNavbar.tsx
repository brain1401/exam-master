"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/Exam Master.svg";
import { useAtom } from "jotai";
import { isNavbarMenuOpenAtom } from "@/app/jotai/createProblems";
import { HiMenu } from "react-icons/hi";

const LIST_ITEM =
  "hidden md:flex text-md font-bold items-center justtify-center";

type Props = {
  loginButton: JSX.Element;
};

export default function PCNavbar({ loginButton }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isNavbarMenuOpenAtom);
  return (
    <nav // navbar
      className="flex border-b border-gray-300"
    >
      <ul className="flex justify-center items-cneter md:gap-3">
        <li className="px-5 py-2 font-bold text-xl md:text-2xl ml-[1rem] md:ml-[3rem]">
          <Link href="/">
            <Image src={Logo} alt="logo" className="w-[8rem] h-[2rem]" />
          </Link>
        </li>
        <li className={LIST_ITEM}>
          <Link href="/exam">문제 풀기</Link>
        </li>
        <li className={LIST_ITEM}>
          <Link href="/manage">문제 관리</Link>
        </li>
        <li className={LIST_ITEM}>
          <Link href="/create">문제 생성</Link>
        </li>
        <li className="hidden md:list-item md:absolute md:top-0 md:right-[10vw]">
          {loginButton}
        </li>
        <li className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <HiMenu className="text-[1.9rem] absolute top-[0.5rem] right-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
