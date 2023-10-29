"use client";
import { useAtom } from "jotai";
import { isNavbarMenuOpenAtom } from "@/app/jotai/navbar";

export default function NavBackDrop() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isNavbarMenuOpenAtom);
  return (
    <div // backdrop
      className={`${
        isMenuOpen ? "block md:hidden" : "hidden"
      } z-5 fixed left-0 top-0 h-full w-full bg-black opacity-50 backdrop-blur-md`}
      onClick={() => setIsMenuOpen(false)}
    ></div>
  );
}
