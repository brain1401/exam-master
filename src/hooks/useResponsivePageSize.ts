import { useEffect } from "react";
import useCustomMediaQuery from "./useCustomMediaQuery";

export default function useResponsivePageSize(
  setPageSize: (pageSize: number) => void,
  setProblemSetsPage: (problemSetsPage: number) => void,
) {
  //화면 너비에 따라 pagination 사이즈 변경하기 위한 media query
  const {
    mediaQuery: { isXxs, isXs, isSm, isMd, isLg, isXl },
  } = useCustomMediaQuery();

  useEffect(() => {
    if (isXxs) {
      setPageSize(2);
      setProblemSetsPage(1);
    } else if (isXs) {
      setPageSize(4);
      setProblemSetsPage(1);
    } else if (isSm) {
      setPageSize(4);
      setProblemSetsPage(1);
    } else if (isMd) {
      setPageSize(6);
      setProblemSetsPage(1);
    } else if (isLg) {
      setPageSize(8);
      setProblemSetsPage(1);
    } else if (isXl) {
      setPageSize(10);
      setProblemSetsPage(1);
    }
  }, [isXxs, isXs, isSm, isMd, isLg, isXl, setProblemSetsPage, setPageSize]);

  return null;
}
