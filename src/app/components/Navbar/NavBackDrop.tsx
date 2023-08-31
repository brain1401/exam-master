"use client";
import { useAtom } from "jotai";
import { isNavbarMenuOpenAtom } from "@/app/jotai/createProblems";

export default function NavBackDrop() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isNavbarMenuOpenAtom);
  return (
    <div // backdrop
      className={`${
        isMenuOpen ? "block md:hidden" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-black opacity-50 z-5 backdrop-blur-md`}
      onClick={() => setIsMenuOpen(false)}
    ></div>
  );
}
