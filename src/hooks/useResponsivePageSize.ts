import { useEffect } from "react";
import useCustomMediaQuery from "./useCustomMediaQuery";
import usePagenationState from "./usePagenationState";
import { getSetPageFunction } from "@/utils/pagination";

export default function useResponsivePageSize(
  type?: "results" | "problemSets" | "publicProblemSet",
) {
  //화면 너비에 따라 pagination 사이즈 변경하기 위한 media query
  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const {
    setPageSize,
    setProblemSetsPage,
    setResultsPage,
    setPublicProblemSetsPage,
  } = usePagenationState();

  useEffect(() => {
    const setPage = getSetPageFunction({
      type,
      setProblemSetsPage,
      setPublicProblemSetsPage,
      setResultsPage,
    });

    if (isXxs) {
      if (type === "publicProblemSet") {
        setPageSize(2);
      } else {
        setPageSize(2);
      }
    } else if (isXs) {
      if (type === "publicProblemSet") {
        setPageSize(4);
      } else {
        setPageSize(4);
      }
    } else if (isSm) {
      if (type === "publicProblemSet") {
        setPageSize(6);
      } else {
        setPageSize(4);
      }
    } else if (isMd) {
      if (type === "publicProblemSet") {
        setPageSize(6);
      } else {
        setPageSize(6);
      }
    } else if (isLg) {
      if (type === "publicProblemSet") {
        setPageSize(9);
      } else {
        setPageSize(8);
      }
    } else if (isXl) {
      if (type === "publicProblemSet") {
        setPageSize(9);
      } else {
        setPageSize(10);
      }
    }

    setPage && setPage(1);
  }, [
    isXxs,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    setPublicProblemSetsPage,
    setProblemSetsPage,
    setResultsPage,
    setPageSize,
    type,
  ]);

  return null;
}
