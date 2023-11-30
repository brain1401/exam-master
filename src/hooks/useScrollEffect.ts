import { useLayoutEffect } from "react";

export default function useScrollEffect(dependencies: any[] = []) {
  useLayoutEffect(() => {
    window.scrollTo({ top: -10000, left: 0 });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return null;
}
