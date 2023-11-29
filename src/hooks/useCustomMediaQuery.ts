import { useAtom } from "jotai";
import { mediaQueryAtom } from "@/jotai/mediaQuery";
export default function useCustomMediaQuery() {
  const [mediaQuery, setMediaQuery] = useAtom(mediaQueryAtom);
  return {
    mediaQuery,
    setMediaQuery,
  }
}
