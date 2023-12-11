import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  resetAction,
  setExamPageAction,
  setExamMaxPageAction,
  selectExamMaxPage,
  selectExamPage,
  selectManageMaxPage,
  selectManagePage,
  selectResultMaxPage,
  selectResultPage,
  setManageMaxPageAction,
  setManagePageAction,
  setResultMaxPageAction,
  setResultPageAction,
} from "@/slices/pagenation";
import { useCallback } from "react";
export default function usePagenationState() {
  const dispatch = useAppDispatch();

  const resultsPage = useAppSelector(selectResultPage);
  const resultsMaxPage = useAppSelector(selectResultMaxPage);
  const managePage = useAppSelector(selectManagePage);
  const manageMaxPage = useAppSelector(selectManageMaxPage);
  const examPage = useAppSelector(selectExamPage);
  const examMaxPage = useAppSelector(selectExamMaxPage);

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

  const setManagePage = useCallback(
    (page: number) => {
      dispatch(setManagePageAction(page));
    },
    [dispatch],
  );

  const setManageMaxPage = useCallback(
    (page: number) => {
      dispatch(setManageMaxPageAction(page));
    },
    [dispatch],
  );

  const setExamPage = useCallback(
    (page: number) => {
      dispatch(setExamPageAction(page));
    },
    [dispatch],
  );

  const setExamMaxPage = useCallback(
    (page: number) => {
      dispatch(setExamMaxPageAction(page));
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch(resetAction());
  }, [dispatch]);

  return {
    resultsPage,
    resultsMaxPage,
    managePage,
    manageMaxPage,
    examPage,
    examMaxPage,
    setResultsPage,
    setResultsMaxPage,
    setManagePage,
    setManageMaxPage,
    setExamPage,
    setExamMaxPage,
    reset,
  };
}
