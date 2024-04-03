import {
  pageSizeAtom,
  problemSetsMaxPageAtom,
  problemSetsPageAtom,
  publicProblemSetsMaxPageAtom,
  publicProblemSetsPageAtom,
  resetAction,
  resultMaxPageAtom,
  resultPageAtom,
} from "@/jotai/pagination";

import { useAtom, useSetAtom } from "jotai";
export default function usePagenationState() {
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);
  const [problemSetsPage, setProblemSetsPage] = useAtom(problemSetsPageAtom);
  const [problemSetsMaxPage, setProblemSetsMaxPage] = useAtom(
    problemSetsMaxPageAtom,
  );
  const [resultPage, setResultsPage] = useAtom(resultPageAtom);
  const [resultMaxPage, setResultsMaxPage] = useAtom(resultMaxPageAtom);
  const [publicProblemSetsPage, setPublicProblemSetsPage] = useAtom(
    publicProblemSetsPageAtom,
  );
  const [publicProblemSetsMaxPage, setPublicProblemSetsMaxPage] = useAtom(
    publicProblemSetsMaxPageAtom,
  );
  const reset = useSetAtom(resetAction);

  return {
    resultPage,
    resultMaxPage,
    problemSetsPage,
    problemSetsMaxPage,
    pageSize,
    publicProblemSetsPage,
    publicProblemSetsMaxPage,
    setProblemSetsPage,
    setProblemSetsMaxPage,
    setResultsPage,
    setResultsMaxPage,
    setPageSize,
    setPublicProblemSetsPage,
    setPublicProblemSetsMaxPage,
    reset,
  };
}
