import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export default function useCustomMediaQuery() {
  const [isXxs, setIsXxs] = useState(false);
  const [isXs, setIsXs] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false); 
  const [isLg, setIsLg] = useState(false);
  const [isXl, setIsXl] = useState(false);

  // 각 화면 크기 범위에 맞는 min-width와 max-width 설정
  const xxs = useMediaQuery({
    query: "(max-width: 367px)",
  });
  const xs = useMediaQuery({
    query: "(min-width: 368px) and (max-width: 639px)",
  });
  const sm = useMediaQuery({
    query: "(min-width: 640px) and (max-width: 668px)",
  });
  const md = useMediaQuery({
    query: "(min-width: 669px) and (max-width: 1023px)",
  });
  const lg = useMediaQuery({
    query: "(min-width: 1024px) and (max-width: 1279px)",
  });
  const xl = useMediaQuery({ query: "(min-width: 1280px)" }); // xl 이상의 경우는 max-width가 필요 없음

  useEffect(() => {
    setIsXxs(xxs);
    setIsXs(xs);
    setIsSm(sm);
    setIsMd(md);
    setIsLg(lg);
    setIsXl(xl);
  }, [xxs,xs, sm, md, lg, xl]);

  return {
    isXxs,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
  };
}
