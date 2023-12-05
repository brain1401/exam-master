"use client";
import useIsMobileNavMenuOpen from "@/hooks/useIsMobileNavMenuOpen";

export default function NavBackDrop() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useIsMobileNavMenuOpen();
  return (
    <div // backdrop
      className={`${
        isMobileMenuOpen ? "block md:hidden" : "hidden"
      } fixed left-0 top-0 z-40 h-full w-full bg-black opacity-50 backdrop-blur-md`}
      onClick={() => setMobileMenuOpen(false)}
    ></div>
  );
}
