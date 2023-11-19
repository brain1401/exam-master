"use client";
import { useAtom } from "jotai";
import { isNavbarMenuOpenAtom } from "@/jotai/navbar";

export default function NavBackDrop() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isNavbarMenuOpenAtom);
  return (
    <div // backdrop
      className={`${
        isMenuOpen ? "block md:hidden" : "hidden"
      } z-40 fixed left-0 top-0 h-full w-full bg-black opacity-50 backdrop-blur-md`}
      onClick={() => setIsMenuOpen(false)}
    ></div>
  );
}
