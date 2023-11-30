"use client";

import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export default function MediaQuery() {
  const { setMediaQuery } = useCustomMediaQuery();

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
    setMediaQuery({
      isXxs: xxs,
      isXs: xs,
      isSm: sm,
      isMd: md,
      isLg: lg,
      isXl: xl,
    });
  }, [xxs, xs, sm, md, lg, xl, setMediaQuery]);

  return null;
}
