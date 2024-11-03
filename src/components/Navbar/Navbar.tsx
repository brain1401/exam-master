"use client";
import Link from "next/link";
import Logo from "../../../public/images/Exam Master.svg";
import { HiMenu } from "react-icons/hi";
import useIsMobileNavMenuOpen from "@/hooks/useIsMobileNavMenuOpen";
import { useTheme } from "next-themes";
import ToggleThemeButton from "../ui/ToggleThemeButton";

const LIST_ITEM =
  "hidden md:flex text-md font-bold items-center justify-center list-none";

export const NAV_ITEMS = [
  { href: "/exam", text: "내 문제 풀기" },
  { href: "/manage", text: "내 문제 관리" },
  { href: "/create", text: "문제 만들기" },
  { href: "/generate", text: "AI 문제 생성" },
  { href: "/results", text: "시험 결과" },
  { href: "/about", text: "서비스 안내" },
];

type Props = {
  loginButton: JSX.Element;
};

export default function Navbar({ loginButton }: Props) {
  const { resolvedTheme } = useTheme();
  const { toggleMobileMenu } = useIsMobileNavMenuOpen();

  return (
    <nav className="relative z-30 flex h-[3.6rem] justify-center after:absolute after:bottom-0 after:left-[-10rem] after:right-[-10rem] after:h-[1px] after:bg-gray-300 after:content-['']">
      <div className="flex w-[100dvw] max-w-[110rem] items-center justify-center">
        <div className="flex w-full items-center justify-between md:gap-3">
          <div className="flex items-center justify-center">
            <div className="ml-[1rem] px-5 py-2 text-xl font-bold md:ml-[3rem] md:text-2xl">
              <Link href="/">
                <Logo className="h-[2rem] w-[8rem] fill-primary" />
              </Link>
            </div>
            <ul className="flex items-center gap-3">
              {NAV_ITEMS.map((item, index) => (
                <li key={index} className={LIST_ITEM}>
                  <Link href={item.href} className="py-2">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="hidden md:mr-[10vw] md:flex md:gap-x-2">
              <ToggleThemeButton />
              <div className="flex h-full w-full items-center justify-center">
                {loginButton}
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-2 pr-[1.3rem] md:hidden">
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
