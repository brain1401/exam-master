import {
  Problem,
  ImageType,
  ImageSchema,
  ExamProblem,
  ProblemSetWithPagination,
  ResultsWithPagination,
  HandleImageCallback,
  ProblemReplacedImageKeyAndFile,
  PresignedPostAlreadyExistsCallback,
  toBeCallbackedItSelf,
  PublicProblemSetWithPagination,
  PrefetchPaginationType,
  ProblemSetComment,
  PublicExamProblemSet,
  ExamProblemSet,
  ExamProblemAnswer,
  uuidSchema,
} from "@/types/problems";
import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import axios, { isAxiosError } from "axios";
import { Flatten, Prettify } from "./type";
import { Like } from "@/components/publicProblem/PublicProblemExam";

export const isCardOnBeingWrited = (problem: Problem | undefined) => {
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

export function isImageUrlObject(image: any): image is ImageType {
  return ImageSchema.safeParse(image).success;
}

export function isImageKeyObject(image: any): image is { key: string } {
  return typeof image === "object" && typeof image.key === "string";
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
  if (problem.isAdditionalViewButtonClicked && problem.additionalView === "") {
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
  debouncedSearchString: string,
  problemSetsPage: number,
  pageSize: number,
  setProblemSetsMaxPage: (maxPage: number) => void,
) {
  try {
    if (pageSize === 0) return null;

    let res;

    if (debouncedSearchString.trim().length > 0) {
      res = await axios.get("/api/getProblemSetsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: problemSetsPage,
          pageSize,
        },
        timeout: 3000,
      });
    } else if (debouncedSearchString.trim().length === 0) {
      res = await axios.get("/api/getProblemSets", {
        params: {
          page: problemSetsPage,
          pageSize,
        },
        timeout: 3000,
      });
    }

    const data: ProblemSetWithPagination = res?.data;

    if (data) {
      setProblemSetsMaxPage(data.pagination.pageCount || 1);
      return data;
    } else {
      return null;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchProblemSetsMaxPage(
  debouncedSearchString: string,
  pageSize: number,
) {
  try {
    if (pageSize === 0) return null;
    let res;

    if (debouncedSearchString.trim().length > 0) {
      res = await axios.get("/api/getProblemSetsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: 1,
          pageSize,
        },
        timeout: 3000,
      });
    } else if (debouncedSearchString.trim().length === 0) {
      res = await axios.get("/api/getProblemSets", {
        params: {
          page: 1,
          pageSize,
        },
      });
    }

    const data: ProblemSetWithPagination = res?.data;

    if (data) {
      return data.pagination.pageCount;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchExamResults(
  debouncedSearchString: string,
  resultsPage: number,
  pageSize: number,
  setResultsMaxPage: (maxPage: number) => void,
) {
  try {
    if (pageSize === 0) return null;
    let res;

    if (debouncedSearchString.trim().length > 0) {
      res = await axios.get("/api/getExamResultsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: resultsPage,
          pageSize,
        },
        timeout: 3000,
      });
    } else if (debouncedSearchString.trim().length === 0) {
      res = await axios.get("/api/getExamResults", {
        params: {
          page: resultsPage,
          pageSize,
        },
        timeout: 3000,
      });
    }

    const data: ResultsWithPagination = res?.data;

    console.log(data);

    if (data) {
      setResultsMaxPage(data.pagination.pageCount);
      return data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과들을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchExamResultsMaxPage(
  debouncedSearchString: string,
  pageSize: number,
) {
  try {
    if (pageSize === 0) return null;
    let res;
    if (debouncedSearchString.trim().length > 0) {
      res = await axios.get("/api/getExamResultsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: 1,
          pageSize,
        },
        timeout: 3000,
      });
    } else if (debouncedSearchString.trim().length === 0) {
      res = await axios.get("/api/getExamResults", {
        params: {
          page: 1,
          pageSize,
        },
      });
    }

    const data: ResultsWithPagination = res?.data;

    if (data) {
      return data.pagination.pageCount;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과들을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchPublicProblemSets(
  debouncedSearchString: string,
  problemSetsPage: number,
  pageSize: number,
  orderBy: string,
  setPublicProblemSetsMaxPage?: (maxPage: number) => void,
) {
  try {
    if (pageSize === 0) return null;

    let res;

    if (debouncedSearchString.trim().length > 0) {
      res = await axios.get("/api/getPublicProblemSetsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: problemSetsPage,
          pageSize,
          orderBy,
        },
        timeout: 3000,
      });
    } else if (debouncedSearchString.trim().length === 0) {
      res = await axios.get("/api/getPublicProblemSets", {
        params: {
          page: problemSetsPage,
          pageSize,
          orderBy,
        },
        timeout: 3000,
      });
    }

    const data: PublicProblemSetWithPagination = res?.data;

    if (data) {
      setPublicProblemSetsMaxPage &&
        setPublicProblemSetsMaxPage(data.pagination.pageCount || 1);
      return data;
    } else {
      return null;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchExamProblems(problemSetUUID: string) {
  try {
    const { data } = await axios.get<ExamProblemSet>(
      `/api/getExamProblemsByProblemSetUUID`,
      {
        params: {
          UUID: problemSetUUID,
        },
      },
    );

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function fetchPublicProblemSetsMaxPage(
  debouncedSearchString: string,
  pageSize: number,
) {
  try {
    if (pageSize === 0) return null;
    let res;
    if (debouncedSearchString.trim().length > 0) {
      res = await axios.get("/api/getPublicProblemSetsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: 1,
          pageSize,
        },
        timeout: 3000,
      });
    } else if (debouncedSearchString.trim().length === 0) {
      res = await axios.get("/api/getPublicProblemSets", {
        params: {
          page: 1,
          pageSize,
        },
      });
    }

    const data: PublicProblemSetWithPagination = res?.data;

    if (data) {
      return data.pagination.pageCount;
    }
    else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
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

export function isExamProblemAsnwered(problem: ExamProblem) {
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

export async function generateFileHash(file: File): Promise<string> {
  // File 객체를 ArrayBuffer로 읽어옴
  const arrayBuffer = await file.arrayBuffer();

  // crypto.subtle.digest를 사용하여 SHA-256 해시를 계산
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  // 해시 값을 Hex 문자열로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // ArrayBuffer를 byte array로 변환
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * 분석된 문제 이미지를 처리하고 콜백을 실행하는 비동기 함수입니다.
 *
 * @template T - 콜백 함수의 반환 타입입니다.
 * @param {Object} options - 함수 옵션 객체입니다.
 * @param {ProblemReplacedImageKeyAndFile[]} options.problems - 문제 이미지가 포함된 배열입니다.
 * @param {HandleImageCallback<T>} options.callback - 이미지 처리를 위한 콜백 함수입니다.
 * @param {boolean} options.skipDuplicated - 중복된 이미지를 건너뛸지 여부를 나타내는 값입니다.
 * @param {true} options.flatResult - 결과를 평면화할지 여부를 나타내는 값입니다.
 * @returns {Promise<Prettify<Flatten<T>>>[]} - 평면화된 결과의 배열을 포함하는 프로미스 객체입니다.
 */
export async function analyzeProblemsImagesAndDoCallback<T>({
  problems,
  callback,
  skipDuplicated,
  flatResult,
}: {
  problems: ProblemReplacedImageKeyAndFile[];
  callback: HandleImageCallback<T>;
  skipDuplicated: boolean;
  flatResult: true;
}): Promise<Prettify<Flatten<T>>[]>;

/**
 * 분석된 문제 이미지를 처리하고 콜백 함수를 실행하는 비동기 함수입니다.
 *
 * @template T - 콜백 함수의 반환 타입
 * @param {Object} options - 함수 옵션
 * @param {ProblemReplacedImageKeyAndFile[]} options.problems - 문제 이미지 배열
 * @param {HandleImageCallback<T>} options.callback - 이미지 처리를 위한 콜백 함수
 * @param {boolean} options.skipDuplicated - 중복된 이미지를 건너뛸지 여부
 * @param {false} options.flatResult - 결과를 평면화할지 여부
 * @returns {Promise<Prettify<T>[]>} - 콜백 함수의 반환 타입을 가진 Promise 배열
 */
export async function analyzeProblemsImagesAndDoCallback<T>({
  problems,
  callback,
  skipDuplicated,
  flatResult,
}: {
  problems: ProblemReplacedImageKeyAndFile[];
  callback: HandleImageCallback<T>;
  skipDuplicated: boolean;
  flatResult: false;
}): Promise<Prettify<T>[]>;

export async function analyzeProblemsImagesAndDoCallback<T>({
  problems,
  callback,
  skipDuplicated = false,
  flatResult = true,
}: {
  problems: ProblemReplacedImageKeyAndFile[];
  callback: HandleImageCallback<T>;
  skipDuplicated: boolean;
  flatResult: boolean;
}) {
  const imageCache = new Map<
    string,
    { index: number[]; isUnique: boolean; image: File | { key: string } | null }
  >();

  const imageHashes = await Promise.all(
    problems.map(async (problem) => {
      if (problem && problem.image && isImageFileObject(problem.image)) {
        return generateFileHash(problem.image);
      }
      return null;
    }),
  );

  const toBeCallbacked: toBeCallbackedItSelf[] = [];

  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i];
    if (problem) {
      if (problem.image && isImageFileObject(problem.image)) {
        const hash = imageHashes[i];
        if (!hash) {
          throw new Error("이미지 해시를 생성하는 도중 에러가 발생했습니다.");
        }

        const imageKey = `${hash}-${problem.image.name}`;

        if (imageCache.has(imageKey)) {
          // 이미지 해시가 캐시에 있는 경우 (중복 이미지인 경우)
          const values = imageCache.get(imageKey);
          if (values === undefined)
            throw new Error(
              "캐시에는 있는데 해당하는 이미지 정보를 찾지 못했습니다.",
            );

          const { index, image } = values;
          imageCache.set(imageKey, {
            index: [...index, i],
            isUnique: false,
            image: problem.image,
          });

          toBeCallbacked.push({
            index: i,
            isUnique: false,
            isNoImage: false,
            isFirstImage: false,
            imageKey: imageKey,
            imageFile: problem.image,
            duplicateIndexes: [],
          });
        } else {
          // 이미지 해시가 캐시에 없는 경우(처음 나오는 이미지인 경우)
          imageCache.set(imageKey, {
            index: [i],
            isUnique: true,
            image: problem.image,
          });
          toBeCallbacked.push({
            index: i,
            isUnique: false,
            isNoImage: false,
            isFirstImage: true,
            imageKey: imageKey,
            imageFile: problem.image,
            duplicateIndexes: [],
          });
        }
      } else if (problem.image && isImageKeyObject(problem.image)) {
        // 이미지가 Key 오브젝트인 경우
        const imageKey = problem.image.key;
        if (imageCache.has(imageKey)) {
          // 이미지 해시가 캐시에 있는 경우 (중복 이미지인 경우)
          const values = imageCache.get(imageKey);
          if (values === undefined)
            throw new Error(
              "캐시에는 있는데 해당하는 이미지 정보를 찾지 못했습니다.",
            );
          const { index, image } = values;
          imageCache.set(imageKey, {
            index: [...index, i],
            isUnique: false,
            image: problem.image,
          });

          toBeCallbacked.push({
            index: i,
            isUnique: false,
            isNoImage: false,
            isFirstImage: false,
            imageKey: imageKey,
            imageFile: isImageFileObject(image) ? image : null,
            duplicateIndexes: [],
          });
        } else {
          // 이미지 해시가 캐시에 없는 경우 (처음 나오는 이미지인 경우)
          imageCache.set(imageKey, { index: [i], isUnique: true, image: null });
          toBeCallbacked.push({
            index: i,
            isUnique: false,
            isNoImage: false,
            isFirstImage: true,
            imageKey: imageKey,
            imageFile: null,
            duplicateIndexes: [],
          });
        }
      } else {
        toBeCallbacked.push({
          index: i,
          isUnique: false,
          isNoImage: true,
          isFirstImage: null,
          imageKey: null,
          imageFile: null,
          duplicateIndexes: [],
        });
      }
    }
  }

  for (const value of imageCache.values()) {
    const index = value.index;
    const image = value.image;
    const isUnique = value.isUnique;

    for (const i of index) {
      toBeCallbacked[i].isUnique = isUnique;
      if (index.length === 1) continue;
      toBeCallbacked[i].duplicateIndexes = [...index];
    }
  }

  console.log("teBeCallbacked : ", toBeCallbacked);
  let callbackedCount = 0;

  const callbackedProblems: (Awaited<T> | undefined)[] = await Promise.all(
    toBeCallbacked.map(
      async ({
        index,
        imageKey,
        imageFile,
        isNoImage,
        isFirstImage,
        isUnique,
        duplicateIndexes,
      }) => {
        if (skipDuplicated) {
          if (isFirstImage) {
            callbackedCount++;
            return await callback({
              index,
              imageFile,
              imageKey,
              isFirstImage,
              isNoImage,
              isUnique,
              duplicateIndexes,
              toBeCallbacked,
            });
          }
        } else {
          callbackedCount++;
          return await callback({
            index,
            imageFile,
            imageKey,
            isFirstImage,
            isNoImage,
            isUnique,
            duplicateIndexes,
            toBeCallbacked,
          });
        }
      },
    ),
  );

  console.log("callbackedCount : ", callbackedCount);

  if (flatResult) {
    return callbackedProblems.reduce((acc, cur) => {
      if (!cur) return acc;

      return acc.concat(cur);
    }, [] as Awaited<T>[]);
  }
  return callbackedProblems;
}

export async function getPresignedUrlOnS3<T>(
  key: string,
  callback?: PresignedPostAlreadyExistsCallback<T>,
): Promise<PresignedPost | T | null> {
  try {
    const data = await axios.get<PresignedPost>(
      `/api/getPresignedUrlPost?key=${encodeURIComponent(key)}`,
    );
    return data.data;
  } catch (err) {
    if (isAxiosError(err)) {
      const errorCode = err.response?.status;
      if (errorCode === 409) {
        // 이미 해당 키를 가진 이미지가 존재하는 경우
        const callbackResult = callback ? await callback(key) : null;
        if (callback) return callbackResult;
      }
      throw err;
    }
  }

  return null;
}

export function isPresignedPost(
  presignedPost: PresignedPost | any,
): presignedPost is PresignedPost {
  return (
    typeof presignedPost === "object" &&
    typeof presignedPost.url === "string" &&
    typeof presignedPost.fields === "object"
  );
}

export function getQueryKey(type: PrefetchPaginationType) {
  if (type === "manage" || type === "exam") {
    return "problemSets";
  } else if (type === "results") {
    return "results";
  } else {
    return "publicProblemSets";
  }
}

export async function fetchPublicProblemSetComments(
  problemUuid: string | undefined,
) {
  const { data } = await axios.get(
    `/api/getPublicProblemSetComments/?problemSetUUID=${problemUuid}`,
  );
  const comments = data.comments as ProblemSetComment[] | null;

  console.log(comments);

  return comments;
}

export function isExamProblemAnswersAnswered(
  examProblemAnswers: ExamProblemAnswer[],
  totalProblems: number,
) {
  if (!examProblemAnswers || examProblemAnswers.length !== totalProblems) {
    return false;
  }

  return examProblemAnswers.every((examProblemAnswer) => {
    if (Array.isArray(examProblemAnswer.answer)) {
      return examProblemAnswer.answer.some((candidate) => candidate.isAnswer);
    } else if (typeof examProblemAnswer.answer === "string") {
      return examProblemAnswer.answer.trim() !== "";
    }
    return false;
  });
}

export async function fetchPublicProblemLikes(problemUuid: string | undefined) {
  const { data } = await axios.get<Like | null>(
    `/api/getPublicProblemSetLikes/?problemSetUUID=${problemUuid}`,
  );
  if (!data) {
    return null;
  }
  const likes = data.likes as number;
  const liked = data.liked as boolean;
  return {
    likes,
    liked,
  };
}

export async function fetchPublicProblemSetByUUID(problemUuid: string) {
  const { data } = await axios.get<PublicExamProblemSet | null>(
    `/api/getPublicProblemSet/?problemSetUUID=${problemUuid}`,
  );
  return data as PublicExamProblemSet | null;
}

export function isValidUUID(UUID: string) {
  return uuidSchema.safeParse(UUID).success;
}
