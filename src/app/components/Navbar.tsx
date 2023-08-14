"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import LoginButton from "./ui/LoginButton";
import { useState, useEffect, useRef } from "react";
import Logo from "../../../public/Exam Master.svg";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loginButton = session ? (
    <LoginButton type="logout" />
  ) : (
    <LoginButton type="login" />
  );

  const LIST_ITEM =
    "hidden md:flex text-md font-bold items-center justtify-center";
  const MOBILE_LIST_ITEM = "py-2 w-full border-b border-gray-300 text-center";

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
  }, [isMenuOpen]);

  return (
    <>
      <div // mobile menu
        ref={menuRef}
        className={`${
          isMenuOpen
            ? "opacity-100 pointer-events-auto md:hidden translate-x-0"
            : "opacity-0 pointer-events-none translate-x-full"
        } absolute w-3/4 h-screen bg-neutral-100 top-0 right-0 z-10 transition-all duration-300 ease-in-out`}
      >
        <ul className="flex flex-col justify-center items-center w-full">
          <li className="flex justify-center items-center border-b border-gray-300 w-full py-2 ">
            <Image src={Logo} alt="logo" className="w-[8rem] h-[2rem]" />
          </li>
          <li className={MOBILE_LIST_ITEM}>
            <Link href="/exam" onClick={() => setIsMenuOpen(false)}>
              문제 풀기
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

      <div // backdrop
        className={`${
          isMenuOpen ? "block md:hidden" : "hidden"
        } fixed top-0 left-0 w-full h-full bg-black opacity-50 z-5 backdrop-blur-md`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

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
    </>
  );
}
