"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/Exam Master.svg";
import { useAtom } from "jotai";
import { isNavbarMenuOpenAtom } from "@/app/jotai/navbar";
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
      <ul className="items-cneter flex justify-center md:gap-3">
        <li className="ml-[1rem] px-5 py-2 text-xl font-bold md:ml-[3rem] md:text-2xl">
          <Link href="/">
            <Image src={Logo} alt="logo" className="h-[2rem] w-[8rem]" />
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
        <li className="hidden md:absolute md:right-[10vw] md:top-0 md:list-item">
          {loginButton}
        </li>
        <li className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <HiMenu className="absolute right-5 top-[0.5rem] text-[1.9rem]" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
