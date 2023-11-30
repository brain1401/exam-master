import { useEffect } from "react";
export default function useScrollEffect(dependencies: any[]) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [dependencies]);

  return null;
}
