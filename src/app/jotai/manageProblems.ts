import { ProblemSetResponse } from "@/types/card";
import { atom } from "jotai";
import axios from "axios";
import { atomsWithQuery } from "jotai-tanstack-query";

export const problemSetCurrentPageAtom = atom(1);

export const [problemSetAtomsWithQuery] = atomsWithQuery((get) => ({
  queryKey: ["problemSets",get(problemSetCurrentPageAtom)],
  queryFn: async ({queryKey: [, page]}) => {
    if (typeof window === "undefined") return null;
    const res = await axios.get("/api/getProblemSets", {
      params: {
        page,
      },
    });
    return res.data as ProblemSetResponse;
  },
}));
