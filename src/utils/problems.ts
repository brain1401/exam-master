import {
  Problem,
  MongoDBImageType,
  ImageSchema,
  ExamProblem,
  ProblemSetWithPagination,
  ResultsWithPagination,
} from "@/types/problems";
import axios from "axios";

export const isCardOnBeingWrited = (problem: Problem) => {
  if (!problem) {
    return false;
  }
  if (problem.question !== "") {
    return true;
  }

  if (
    problem.candidates !== null &&
    problem.candidates.some((candidate) => candidate.text !== "")
  ) {
    return true;
  }

  if (problem.image !== null) {
    return true;
  }

  if (problem.additionalView !== "") {
    return true;
  }

  if (problem.type === "sub" && problem.subAnswer !== "") {
    return true;
  }

  return false;
};

export function isImageFileObject(image: any): image is File {
  return (
    image &&
    typeof image === "object" &&
    typeof image.name === "string" &&
    typeof image.size === "number" &&
    typeof image.type === "string" &&
    typeof image.lastModified === "number"
  );
}

export function isImageUrlObject(image: any): image is MongoDBImageType {
  return ImageSchema.safeParse(image).success;
}

export const isProblemEmpty = (problem: Problem) => {
  if (!problem) {
    return true;
  }
  if (problem.question === "") {
    return true;
  }

  if (
    problem.candidates &&
    problem.candidates.some((candidate) => candidate.text === "")
  ) {
    return true;
  }
  if (problem.isAdditiondalViewButtonClicked && problem.additionalView === "") {
    return true;
  }

  if (problem.isImageButtonClicked && problem.image === null) {
    return true;
  }

  if (
    problem.candidates &&
    !problem.candidates?.some((candidate) => candidate.isAnswer === true)
  ) {
    return true;
  }

  if (problem.type === "sub" && problem.subAnswer === "") {
    return true;
  }

  return false;
};

export async function fetchProblemSets(
  isSearching: boolean,
  debouncedSearchString: string,
  problemSetsPage: number,
  pageSize: number,
  setProblemSetsMaxPage: (maxPage: number) => void,
) {
  try {
    if (pageSize === 0) return null;

    let res;
    if (isSearching) {
      if (debouncedSearchString.trim().length > 0) {
        res = await axios.get("/api/getProblemSetsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page: problemSetsPage,
            pageSize,
          },
          timeout: 3000,
        });
      }
    } else {
      if (debouncedSearchString.trim().length === 0) {
        res = await axios.get("/api/getProblemSets", {
          params: {
            page: problemSetsPage,
            pageSize,
          },
          timeout: 3000,
        });
      }
    }

    const data: ProblemSetWithPagination = res?.data;

    if (data) {
      setProblemSetsMaxPage(data.pagination.pageCount || 1);
      return data;
    } else {
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemSetsMaxPage(
  isSearching: boolean,
  debouncedSearchString: string,
  pageSize: number,
) {
  try {
    if (pageSize === 0) return null;
    let res;
    if (isSearching) {
      if (debouncedSearchString.trim().length > 0) {
        res = await axios.get("/api/getProblemSetsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page: 1,
            pageSize,
          },
          timeout: 3000,
        });
      }
    } else {
      if (debouncedSearchString.trim().length === 0) {
        res = await axios.get("/api/getProblemSets", {
          params: {
            page: 1,
            pageSize,
          },
        });
      }
    }
    const data: ProblemSetWithPagination = res?.data;

    if (data) {
      return data.pagination.pageCount;
    }
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchExamResults(
  isSearching: boolean,
  debouncedSearchString: string,
  resultsPage: number,
  pageSize: number,
  setResultsMaxPage: (maxPage: number) => void,
) {
  try {
    if (pageSize === 0) return null;
    let res;

    if (isSearching) {
      if (debouncedSearchString.trim().length > 0) {
        res = await axios.get("/api/getExamResultsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page: resultsPage,
            pageSize,
          },
          timeout: 3000,
        });
      }
    } else {
      if (debouncedSearchString.trim().length === 0) {
        res = await axios.get("/api/getExamResults", {
          params: {
            page: resultsPage,
            pageSize,
          },
          timeout: 3000,
        });
      }
    }
    const data: ResultsWithPagination = res?.data;

    console.log(data);

    if (data) {
      setResultsMaxPage(data.pagination.pageCount || 1);
      return data;
    } else {
      throw new Error("시험 결과들을 불러오는 중 오류가 발생했습니다.");
    }
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과들을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getExamResultsMaxPage(
  isSearching: boolean,
  debouncedSearchString: string,
  pageSize: number,
) {
  try {
    if (pageSize === 0) return null;
    let res;
    if (isSearching) {
      if (debouncedSearchString.trim().length > 0) {
        res = await axios.get("/api/getExamResultsByName", {
          params: {
            name: debouncedSearchString.trim(),
            page: 1,
            pageSize,
          },
          timeout: 3000,
        });
      }
    } else {
      if (debouncedSearchString.trim().length === 0) {
        res = await axios.get("/api/getExamResults", {
          params: {
            page: 1,
            pageSize,
          },
        });
      }
    }
    const data: ResultsWithPagination = res?.data;

    if (data) {
      return data.pagination.pageCount;
    }
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과들을 불러오는 중 오류가 발생했습니다.");
  }
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
  }).format(date);
}

export function isProblemAsnwered(problem: ExamProblem) {
  if (!problem) {
    throw new Error("something is null");
  }

  const result =
    problem.type === "obj"
      ? problem.candidates?.some((candidate) => candidate.isAnswer)
      : problem.subAnswer !== null && problem.subAnswer !== "";

  if (result === undefined) throw new Error("result is undefined");

  return result;
}

export function isAnsweredMoreThanOne(problem: ExamProblem) {
  if (!problem || !problem.candidates) {
    throw new Error("something is null");
  }

  return (
    problem.candidates.filter((candidate) => candidate.isAnswer).length > 1
  );
}

export async function validateExamProblem(
  problem: ExamProblem,
  answer: string | (number | null)[],
) {
  let finalResult: boolean | null = null;

  if (!problem || !problem.uuid) throw new Error("something is null");

  if (problem.type === "obj") {
    if (!problem.candidates) throw new Error("candidates is null");

    const answeredId = problem.candidates
      .filter((candidate) => candidate.isAnswer)
      .map((candidate) => candidate.id);

    const isCorrect = isAnswerArray(answer)
      ? answer.every((id) => answeredId.includes(id))
      : null;

    finalResult = isCorrect;
  } else if (problem.type === "sub") {
    if (!problem.subAnswer) throw new Error("subAnswer is null");

    const isCorrect = problem.subAnswer === answer;

    finalResult = isCorrect;
  }

  if (finalResult === null) throw new Error("finalResult is null");

  return finalResult;
}

export function isAnswerString(
  answer: string | (number | null)[],
): answer is string {
  return typeof answer === "string";
}

export function isAnswerArray(
  answer: string | (number | null)[],
): answer is (number | null)[] {
  return Array.isArray(answer);
}
