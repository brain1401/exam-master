"use client";
import Link from "next/link";
import Logo from "../../../public/images/Exam Master.svg";
import { HiMenu } from "react-icons/hi";
import useIsMobileNavMenuOpen from "@/hooks/useIsMobileNavMenuOpen";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useEffect } from "react";
import ToggleThemeButton from "../ui/ToggleThemeButton";

const LIST_ITEM =
  "hidden md:flex text-md font-bold items-center justify-center list-none";

type Props = {
  loginButton: JSX.Element;
};

export default function Navbar({ loginButton }: Props) {
  const { resolvedTheme } = useTheme();

  const { toggleMobileMenu } = useIsMobileNavMenuOpen();

  return (
    <nav // navbar
      className="z-30 flex h-[3.6rem] w-full justify-center border-b border-gray-300"
    >
      <div className="flex w-full max-w-[110rem] items-center justify-center">
        <div className="flex w-full items-center justify-between md:gap-3">
          <div className="flex items-center justify-center">
            <div className="ml-[1rem] px-5 py-2 text-xl font-bold md:ml-[3rem] md:text-2xl">
              <Link href="/">
                <Logo
                  className="hidden h-[2rem] w-[8rem] dark:block"
                  fill="white"
                />
                <Logo
                  className="block h-[2rem] w-[8rem] dark:hidden"
                  fill="black"
                />
              </Link>
            </div>
            <ul className="flex items-center gap-3">
              <li className={LIST_ITEM}>
                <Link href="/exam">내 문제 풀기</Link>
              </li>
              <li className={LIST_ITEM}>
                <Link href="/manage">내 문제 관리</Link>
              </li>
              <li className={LIST_ITEM}>
                <Link href="/create">문제 생성</Link>
              </li>
              <li className={LIST_ITEM}>
                <Link href="/results">시험 결과</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="hidden md:mr-[10vw] md:flex md:gap-x-2 ">
              <ToggleThemeButton />
              <div className="flex h-full w-full items-center justify-center">
                {loginButton}
              </div>
            </div>
            <div className="flex items-center justify-center pr-[1.3rem] md:hidden">
              <ToggleThemeButton />
              <button onClick={() => toggleMobileMenu()}>
                <HiMenu className="text-[1.9rem]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
