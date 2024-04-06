import { useEffect, useCallback } from "react";

export default function usePreventClose() {
  //페이지를 닫거나 새로고침을 할 때 경고창을 띄우는 이벤트 리스너 등록 및 해제
  const preventClose = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; //Chrome에서 동작하도록; deprecated
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, [preventClose]);
}
