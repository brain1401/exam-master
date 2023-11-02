"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/Exam Master.svg";
import { useRef, useEffect } from "react";
import { isNavbarMenuOpenAtom } from "@/app/jotai/navbar";
import { useAtom } from "jotai";

const MOBILE_LIST_ITEM = "py-2 w-full border-b border-gray-300 text-center";

type Props = {
  loginButton: JSX.Element;
};
export default function NavMobile({ loginButton }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useAtom(isNavbarMenuOpenAtom);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div // mobile menu
      ref={menuRef}
      className={`${
        isMenuOpen
          ? "pointer-events-auto translate-x-0 opacity-100 md:hidden"
          : "pointer-events-none max-h-0 translate-x-full overflow-hidden opacity-0"
      } absolute right-0 top-0 z-10 h-screen w-3/4 bg-neutral-100 transition-all duration-300 ease-in-out`}
    >
      <ul className="flex w-full flex-col items-center justify-center">
        <li className="flex w-full items-center justify-center border-b border-gray-300 py-2 ">
          <Image src={Logo} alt="logo" className="h-[2rem] w-[8rem]" />
        </li>
        <li className={MOBILE_LIST_ITEM}>
          <Link href="/exam" onClick={() => setIsMenuOpen(false)}>
            문제 풀기
          </Link>
        </li>
        <li className={MOBILE_LIST_ITEM}>
          <Link href="/manage" onClick={() => setIsMenuOpen(false)}>
            문제 관리
          </Link>
        </li>
        <li className={MOBILE_LIST_ITEM}>
          <Link href="/create" onClick={() => setIsMenuOpen(false)}>
            문제 생성
          </Link>
        </li>
        <li className="py-2" onClick={() => setIsMenuOpen(false)}>
          {loginButton}
        </li>
      </ul>
    </div>
  );
}
