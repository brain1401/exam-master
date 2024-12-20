import {
  fetchExamResults,
  fetchProblemSets,
  fetchPublicProblemSets,
  fetchExamResultsMaxPage,
  fetchProblemSetsMaxPage,
  fetchPublicProblemSetsMaxPage,
} from "./problems";
import { PrefetchPaginationType } from "@/types/problems";

type GetSetPageFunctionType = {
  type: "results" | "problemSets" | "publicProblemSet" | undefined;
  setProblemSetsPage: (page: number) => void;
  setPublicProblemSetsPage: (page: number) => void;
  setResultsPage: (page: number) => void;
};

type GetSetMaxPageFunctionType = {
  type: PrefetchPaginationType;
  setProblemSetsMaxPage: (page: number) => void;
  setPublicProblemSetsMaxPage: (page: number) => void;
  setResultsMaxPage: (page: number) => void;
};

export function getSetPageFunction({
  type,
  setProblemSetsPage,
  setPublicProblemSetsPage,
  setResultsPage,
}: GetSetPageFunctionType) {
  switch (type) {
    case "problemSets":
      return setProblemSetsPage;
    case "publicProblemSet":
      return setPublicProblemSetsPage;
    case "results":
      return setResultsPage;
    default:
      throw new Error("Invalid type");
  }
}

export function getSetMaxPageFunction({
  type,
  setProblemSetsMaxPage,
  setPublicProblemSetsMaxPage,
  setResultsMaxPage,
}: GetSetMaxPageFunctionType) {
  switch (type) {
    case "manage":
    case "exam":
      return setProblemSetsMaxPage;
    case "results":
      return setResultsMaxPage;
    case "publicProblemSet":
      return setPublicProblemSetsMaxPage;
    default:
      throw new Error("Invalid type");
  }
}

export function getFetchMaxPageFunction(type: PrefetchPaginationType) {
  switch (type) {
    case "manage":
    case "exam":
      return fetchProblemSetsMaxPage;
    case "results":
      return fetchExamResultsMaxPage;
    case "publicProblemSet":
      return fetchPublicProblemSetsMaxPage;
    default:
      throw new Error("Invalid type");
  }
}

export function getFetchDataFunction(type: PrefetchPaginationType) {
  switch (type) {
    case "manage":
    case "exam":
      return fetchProblemSets;
    case "results":
      return fetchExamResults;
    case "publicProblemSet":
      return fetchPublicProblemSets;
    default:
      throw new Error("Invalid type");
  }
}
