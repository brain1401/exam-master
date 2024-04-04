import {
  publicProblemSetSortAtom,
  publicProblemSetSearchStringAtom,
} from "@/jotai/publicProblem";
import { useAtom } from "jotai";

export default function usePublicProblem() {
  const [sort, setSort] = useAtom(publicProblemSetSortAtom);
  const [searchString, setSearchString] = useAtom(
    publicProblemSetSearchStringAtom,
  );

  return {
    sort,
    setSort,
    searchString,
    setSearchString,
  };
}
