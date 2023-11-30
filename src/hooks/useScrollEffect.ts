import { useLayoutEffect } from "react";
export default function useScrollEffect(dependencies: any[]) {
  useLayoutEffect(() => {
    const root = document.querySelector("#root");
    if (root) {
      window.scrollTo({ top: root.scrollTop })
    }
    console.log(root);
    console.log("scroll to top");
  }, [dependencies]);

  return null;
}
