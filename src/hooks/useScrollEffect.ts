import { useLayoutEffect } from "react";
export default function useScrollEffect(dependencies: any[]) {
  useLayoutEffect(() => {
    window.scrollTo({ top: -1000, left: 0 });
  }, [dependencies]);

  return null;
}
