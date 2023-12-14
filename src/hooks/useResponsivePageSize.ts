import { useEffect } from "react";
import useCustomMediaQuery from "./useCustomMediaQuery";
import usePagenationState from "./usePagenationState";

export default function useResponsivePageSize(
  type?: "results" | "problemSets",
) {
  //화면 너비에 따라 pagination 사이즈 변경하기 위한 media query
  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  const { setPageSize, setProblemSetsPage, setResultsPage } =
    usePagenationState();

  useEffect(() => {
    const setPage =
      type !== undefined
        ? type === "results"
          ? setResultsPage
          : setProblemSetsPage
        : undefined;

    if (isXxs) {
      setPageSize(2);
    } else if (isXs) {
      setPageSize(4);
    } else if (isSm) {
      setPageSize(4);
    } else if (isMd) {
      setPageSize(6);
    } else if (isLg) {
      setPageSize(8);
    } else if (isXl) {
      setPageSize(10);
    }

    setPage && setPage(1);
  }, [
    isXxs,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    setProblemSetsPage,
    setResultsPage,
    setPageSize,
    type,
  ]);

  return null;
}
