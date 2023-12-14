import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  resetAction,
  selectResultMaxPage,
  selectResultPage,
  setResultMaxPageAction,
  setResultPageAction,
  selectProblemSetsMaxPage,
  selectProblemSetsPage,
  setProblemSetsMaxPageAction,
  setProblemSetsPageAction,
  selectPageSize,
  setPageSizeAction,
} from "@/slices/pagenation";
import { useCallback } from "react";
export default function usePagenationState() {
  const dispatch = useAppDispatch();

  const resultsPage = useAppSelector(selectResultPage);
  const resultsMaxPage = useAppSelector(selectResultMaxPage);
  const problemSetsPage = useAppSelector(selectProblemSetsPage);
  const problemSetsMaxPage = useAppSelector(selectProblemSetsMaxPage);
  const pageSize = useAppSelector(selectPageSize);

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.
  const setResultsPage = useCallback(
    (page: number) => {
      dispatch(setResultPageAction(page));
    },
    [dispatch],
  );

  const setResultsMaxPage = useCallback(
    (page: number) => {
      dispatch(setResultMaxPageAction(page));
    },
    [dispatch],
  );

  const setProblemSetsPage = useCallback(
    (page: number) => {
      dispatch(setProblemSetsPageAction(page));
    },
    [dispatch],
  );

  const setProblemSetsMaxPage = useCallback(
    (page: number) => {
      dispatch(setProblemSetsMaxPageAction(page));
    },
    [dispatch],
  );

  const setPageSize = useCallback(
    (size: number) => {
      dispatch(setPageSizeAction(size));
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch(resetAction());
  }, [dispatch]);

  return {
    resultsPage,
    resultsMaxPage,
    problemSetsPage,
    problemSetsMaxPage,
    pageSize,
    setProblemSetsPage,
    setProblemSetsMaxPage,
    setResultsPage,
    setResultsMaxPage,
    setPageSize,
    reset,
  };
}
