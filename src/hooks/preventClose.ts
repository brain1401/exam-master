import {useEffect} from 'react';

export default function usePreventClose() {
  useEffect(() => {
    //페이지를 닫거나 새로고침을 할 때 경고창을 띄우는 이벤트 리스너 등록 및 해제
    function preventClose(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = ""; //Chrome에서 동작하도록; deprecated
    }

    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);
}