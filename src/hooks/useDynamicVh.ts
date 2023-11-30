import { useLayoutEffect } from "react";

export default function useDynamicVh() {
  useLayoutEffect(() => {
    const setDynamicVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setDynamicVh();
    window.addEventListener("resize", setDynamicVh);
    return () => {
      window.removeEventListener("resize", setDynamicVh);
    };
  });
  return null;
}
