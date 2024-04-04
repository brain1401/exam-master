import { publicProblemSetSortAtom } from "@/jotai/publicProblem";
import { useAtom } from "jotai";

export default function usePublicProblem() {
  const [sort, setSort] = useAtom(publicProblemSetSortAtom);

  return {
    sort,
    setSort,
  };
}
