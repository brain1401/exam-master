import {
  RawProblemSetResponse,
  Problem,
  ProblemSetResponse,
  ProblemResponse,
  ExamResult,
  ExamProblem,
  StrapiImage,
  ImageSchema,
  ExamProblemResult,
  ExamResultsWithCount,
  ExamResultsWithCountResponse,
  ExamResultsResponse,
} from "@/types/problems";
import qs from "qs";
import { getUser } from "./user";
import axios from "axios";
import { QueryFunctionContext } from "@tanstack/react-query";

export const checkEnvVariables = () => {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
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

export function isImageUrlObject(image: any): image is StrapiImage {
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

export async function createProblem(
  problem: Problem,
  userId: string,
): Promise<string> {
  if (!problem) {
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }
  try {
    let postId = "";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionType: problem.type,
          question: problem.question,
          additionalView: problem.additionalView,
          candidates: problem.candidates,
          subjectiveAnswer: problem.subAnswer,
          isAnswerMultiple: problem.isAnswerMultiple,
          exam_user: {
            connect: [userId],
          },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제를 생성하는 중 오류가 발생했습니다.");

    const data = await response.json();
    postId = data.data.id;
    return postId;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function uploadImageToProblem(image: File, problemId: string) {
  if (!image) throw new Error("이미지를 생성하는 중 오류가 발생했습니다.");
  try {
    const newFormData = new FormData();
    newFormData.append("files", image as Blob);
    newFormData.append("ref", "api::exam-problem.exam-problem");
    newFormData.append("refId", problemId);
    newFormData.append("field", "image");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        body: newFormData,
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("이미지를 생성하는 중 오류가 발생했습니다.");
  } catch (err) {
    console.log(err);
    throw new Error("이미지를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function createProblemSets(
  userId: string,
  setName: string,
  postIdArray: string[],
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: setName,
          exam_problems: {
            connect: [...postIdArray],
          },
          exam_user: {
            connect: [userId],
          },
        }),
        cache: "no-store",
      },
    );
    if (!response.ok)
      throw new Error("문제를 생성하는 중 오류가 발생했습니다.");

    return response.statusText;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function postProblems(
  setName: string,
  userEmail: string,
  problems: Problem[],
) {
  checkEnvVariables();
  const userId = (await getUser(userEmail)).id;

  // 각 카드에 대한 작업을 병렬로 수행
  const postIdArray = await Promise.all(
    problems.map(async (problem) => {
      if (isProblemEmpty(problem)) throw new Error("문제가 비어있습니다.");

      // 문제와 이미지 생성은 순차적으로 처리
      const postId = await createProblem(problem, userId);
      if (problem?.image && isImageFileObject(problem?.image)) {
        await uploadImageToProblem(problem.image, postId);
      }

      return postId;
    }),
  );

  const response = await createProblemSets(userId, setName, postIdArray);
  return response;
}

export async function checkProblemSetName(name: string, userEmail: string) {
  const query = qs.stringify({
    filters: {
      name: {
        $eq: name,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제집 이름을 확인하는 중 오류가 발생했습니다.");

    const data = await response.json();

    return data.data.length === 0 ? false : true;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 이름을 확인하는 중 오류가 발생했습니다.");
  }
}

export async function getProblemSets(
  userEmail: string,
  page: string,
  pageSize: string,
) {
  const query = qs.stringify({
    filters: {
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
    populate: ["exam_problems"],
    pagination: {
      page,
      pageSize,
    },
    sort: "updatedAt:desc",
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let responseJson: RawProblemSetResponse = await response.json();
    responseJson.data.forEach((problemSet) => {
      problemSet.updatedAt = problemSet.updatedAt.slice(0, 10);
      problemSet.createdAt = problemSet.createdAt.slice(0, 10);
      problemSet.examProblemsCount = problemSet.exam_problems?.length;
      delete problemSet.exam_problems;
    });

    return responseJson;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemSetsByName(
  userEmail: string,
  name: string,
  page: string,
  pageSize: string,
) {
  const query = qs.stringify({
    filters: {
      name: {
        $contains: name,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
    populate: ["exam_problems"],
    pagination: {
      page,
      pageSize,
    },
    sort: "updatedAt:desc",
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let responseJson: RawProblemSetResponse = await response.json();
    responseJson.data.forEach((problemSet) => {
      problemSet.updatedAt = problemSet.updatedAt.slice(0, 10);
      problemSet.createdAt = problemSet.createdAt.slice(0, 10);
      problemSet.examProblemsCount = problemSet.exam_problems?.length;
      delete problemSet.exam_problems;
    });

    return responseJson;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemsSetByUUID(uuid: string, userEmail: string) {
  // filter 조건에 userEmail을 추가해서 해당 유저의 문제집만 가져오도록 했음
  const query = qs.stringify({
    filters: {
      UUID: {
        $eq: uuid,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },

    populate: {
      exam_problems: {
        populate: ["image"],
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let data = await response.json();
    return data.data[0] as ProblemSetResponse;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}
export async function getProblemsSetIdByUUID(uuid: string) {
  const query = qs.stringify({
    filters: {
      UUID: {
        $eq: uuid,
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let data = await response.json();
    return data.data[0].id;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemByUUID(uuid: string, userEmail: string) {
  const query = qs.stringify({
    filters: {
      UUID: {
        $eq: uuid,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제를 불러오는 중 오류가 발생했습니다.");

    let data = await response.json();
    return data.data[0] as Problem;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemById(id: string, userEmail: string) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: id,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("문제를 불러오는 중 오류가 발생했습니다.");

    let data = await response.json();
    return data.data[0] as Problem;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function updateProblem(id: string, problem: Problem) {
  checkEnvVariables();

  if (!problem) {
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionType: problem.type,
        question: problem.question,
        additionalView: problem.additionalView,
        candidates: problem.candidates,
        subjectiveAnswer: problem.subAnswer,
        isAnswerMultiple: problem.isAnswerMultiple,
      }),
      cache: "no-store",
    },
  );
  if (!response.ok)
    throw new Error("문제를 업로드하는 중 오류가 발생했습니다.");
}

export async function deletePhoto(id: string) {
  checkEnvVariables();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/files/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: "no-store",
    },
  );
  if (!response.ok)
    throw new Error("이미지를 삭제하는 중 오류가 발생했습니다.");
}

export async function getProblemPhotoIdByProblemId(id: string) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: id,
      },
    },
    populate: ["image"],
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok)
      throw new Error("문제를 불러오는 중 오류가 발생했습니다.");

    const data = await response.json();
    const imageId = data?.data?.[0]?.image?.id;
    const result = imageId ?? "null";
    return result as string;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function updateProblemSetName(
  name: string,
  problemSetUUID: string,
) {
  checkEnvVariables();
  const problemSetId = await getProblemsSetIdByUUID(problemSetUUID);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets/${problemSetId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        name: name,
      }),
    },
  );
  if (!response.ok)
    throw new Error("문제집 이름을 수정하는 중 오류가 발생했습니다.");
}
export async function updateProblems(
  setName: string,
  problems: Problem[],
  problemSetUUID: string,
  userEmail: string,
) {
  checkEnvVariables();

  //문제집 이름 수정
  await updateProblemSetName(setName, problemSetUUID);

  try {
    for (const problem of problems) {
      if (!problem?.id) {
        //새로 추가된 문제인 경우
        if (problem) {
          problem.id = Number(
            await createProblem(problem, (await getUser(userEmail)).id),
          );
        }

        if (problem?.id) {
          if (problem?.image && isImageFileObject(problem?.image)) {
            await uploadImageToProblem(problem.image, problem.id.toString());
          }
          await linkProblemToProblemSet(
            problem.id.toString(),
            (await getProblemsSetIdByUUID(problemSetUUID)).toString(),
          );
          continue;
        }
      }

      if (!problem?.id) {
        throw new Error("문제를 수정하는 중 오류가 발생했습니다.");
      }

      if (problem && problem?.image && isImageFileObject(problem?.image)) {
        //image가 파일 타입인 경우
        const photoId = await getProblemPhotoIdByProblemId(
          problem.id.toString(),
        );

        if (photoId === "null") {
          //기존에 이미지가 없는 경우
          await uploadImageToProblem(problem.image, problem.id.toString());
        } else {
          //기존에 이미지가 있는 경우
          await deletePhoto(photoId.toString());
          await uploadImageToProblem(problem.image, problem.id.toString());
        }
      } else if (problem && problem?.image === null) {
        //image가 null인 경우
        const photoId = await getProblemPhotoIdByProblemId(
          problem.id.toString(),
        );
        if (photoId !== "null") {
          //기존에 이미지가 있는 경우
          await deletePhoto(photoId.toString());
        }
      }

      //이미지를 제외한 나머지 문제 정보 수정
      await updateProblem(problem.id.toString(), problem);
    }
  } catch (err) {
    console.log(err);
    throw new Error("문제를 수정하는 중 오류가 발생했습니다.");
  }

  return true;
}

export async function checkUserPermissionForProblemSet(
  problemSetUUID: string,
  userEmail: string,
) {
  const query = qs.stringify({
    filters: {
      UUID: {
        $eq: problemSetUUID,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok)
      throw new Error("유저를 검증하는 중 오류가 발생했습니다.");

    const data = await response.json();
    const result = data.data.length === 1 ? "OK" : "NO";

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}

export async function validateProblemId(problemId: string, userEmail: string) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: problemId,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok)
      throw new Error("유저를 검증하는 중 오류가 발생했습니다.");

    const data = await response.json();
    const result = data.data.length === 1 ? "OK" : "NO";

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}
export async function linkProblemToProblemSet(
  problemId: string,
  problemSetId: string,
) {
  checkEnvVariables();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems/${problemId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        exam_problem_sets: {
          connect: [problemSetId],
        },
      }),
    },
  );
  if (!response.ok)
    throw new Error("문제를 문제집에 연결하는 중 오류가 발생했습니다.");
}

export async function getAnswerByProblemId(problemId: number) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: problemId,
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok)
      throw new Error("정답을 불러오는 중 오류가 발생했습니다.");

    const data = await response.json();
    const problem: ProblemResponse = data.data[0];

    const answer =
      problem.questionType === "obj"
        ? problem.candidates
            ?.filter((candidate) => candidate.isAnswer)
            .map((candidate) => candidate.id)
        : problem.subjectiveAnswer;
    return answer;
  } catch (err) {
    console.log(err);
    throw new Error("정답을 불러오는 중 오류가 발생했습니다.");
  }
}

type ProblemsAndSetsName = {
  problemSetsName: string;
  problems: Problem[];
};

type ProblemsAndSetsNameWithUUID = ProblemsAndSetsName & {
  problemSetUUID: string;
};

export function getParsedProblems<T extends boolean>(
  formData: FormData,
  includeUuid: T,
): T extends true ? ProblemsAndSetsNameWithUUID : ProblemsAndSetsName {
  const entries = Array.from(formData.entries());

  const problems: NonNullable<Problem>[] = [];
  let problemSetsName: string | undefined;
  let problemSetUUID: string | undefined;

  for (const [name, value] of entries) {
    if (name === "problemSetsName") {
      problemSetsName = value as string;
      continue;
    }
    if (includeUuid && name === "uuid") {
      problemSetUUID = value as string;
      continue;
    }

    const match = name.match(/(data|image)\[(\d+)\]/);
    if (match) {
      const [, prefix, indexStr] = match;
      const index = parseInt(indexStr);

      if (!problems[index]) {
        problems[index] = {} as NonNullable<Problem>;
      }

      if (prefix === "data") {
        const ProblemData = JSON.parse(value as string);
        problems[index] = {
          ...problems[index],
          ...ProblemData,
        };
      } else if (prefix === "image" && value !== "null") {
        problems[index].image = value as File;
      }
    }
  }

  if (includeUuid) {
    return { problemSetsName, problems, problemSetUUID } as T extends true
      ? ProblemsAndSetsNameWithUUID
      : ProblemsAndSetsName;
  } else {
    return { problemSetsName, problems } as T extends true
      ? ProblemsAndSetsNameWithUUID
      : ProblemsAndSetsName;
  }
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

  if (!problem || !problem.id) throw new Error("something is null");

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

function isAnswerString(answer: string | (number | null)[]): answer is string {
  return typeof answer === "string";
}

function isAnswerArray(
  answer: string | (number | null)[],
): answer is (number | null)[] {
  return Array.isArray(answer);
}

export async function postExamProblemResult(
  problem: ExamProblem,
  result: boolean,
  answer: string | (number | null)[],
  userId: number,
) {
  if (!problem || !problem.id) throw new Error("something is null");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-results`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isCorrect: result,
        exam_user: userId,
        candidates: problem.candidates
          ? problem.candidates.map((candidate) => ({
              id: candidate.id,
              text: candidate.text,
              isSelected: candidate.isAnswer,
            }))
          : null,
        subjectiveAnswered: problem.subAnswer,
        question: problem.question,
        additionalView: problem.additionalView || null,
        questionType: problem.type,
        isAnswerMultiple: problem.isAnswerMultiple,
        correctCandidates: isAnswerArray(answer)
          ? answer
              .map((id) => ({
                id,
                text:
                  problem.candidates?.find((candidate) => candidate.id === id)
                    ?.text ?? "",
              }))
              .toSorted((a, b) => {
                if (!problem.candidates)
                  throw new Error("problem.candidates is null");
                if (
                  problem.candidates.findIndex(
                    (candidate) => candidate.id === a.id,
                  ) >
                  problem.candidates.findIndex(
                    (candidate) => candidate.id === b.id,
                  )
                )
                  return 1;
                if (
                  problem.candidates.findIndex(
                    (candidate) => candidate.id === a.id,
                  ) <
                  problem.candidates.findIndex(
                    (candidate) => candidate.id === b.id,
                  )
                )
                  return -1;
                return 0;
              })
          : null,
        correctSubjectiveAnswer: isAnswerString(answer) ? answer : null,
        image: isImageUrlObject(problem.image) ? problem.image.id : null,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok)
    throw new Error(
      "문제 결과를 생성하는 중 오류가 발생했습니다. (postExamProblemResult)",
    );

  return response.json().then((data) => data.data.id) as Promise<number>;
}

export async function createExamResult(
  examProblemResultId: number[],
  problemSetName: string,
  userId: number,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-results`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exam_problem_results: examProblemResultId,
        problemSetName: problemSetName,
        exam_user: userId,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok)
    throw new Error(
      "시험 결과를 생성하는 중 오류가 발생했습니다. (createExamResult)",
    );

  const data = await response.json();
  const uuid = data.data.uuid;

  if (!uuid) throw new Error("uuid is null");

  return uuid;
}

export async function getExamResultByUUID(uuid: string, userEmail: string) {
  const query = qs.stringify({
    filters: {
      uuid: {
        $eq: uuid,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
    populate: {
      exam_problem_results: {
        populate: ["image"],
      },
    },
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-results?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok)
      throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");

    const data = await response.json();
    const examResult: ExamResult = data.data[0];

    return examResult.exam_problem_results;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getExamResults(
  userEmail: string,
  page: string,
  pageSize: string,
) {
  const query = qs.stringify({
    filters: {
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
    pagination: {
      page,
      pageSize,
    },
    populate: ["exam_problem_results"],
    sort: "updatedAt:desc",
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-results?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok)
      throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");

    const data = await response.json();
    const result = {
      ...data,
      data: data.data.map((examProblemResult: any) => {
        const newExamProblemResult: any = examProblemResult;
        newExamProblemResult["examProblemResultsCount"] =
          examProblemResult.exam_problem_results?.length;
        delete newExamProblemResult.exam_problem_results;

        return newExamProblemResult;
      }),
    };

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getExamResultsByName(
  userEmail: string,
  name: string,
  page: string,
  pageSize: string,
) {
  const query = qs.stringify({
    filters: {
      problemSetName: {
        $contains: name,
      },
      exam_user: {
        email: {
          $eq: userEmail,
        },
      },
    },
    pagination: {
      page,
      pageSize,
    },
    populate: ["exam_problem_results"],
    sort: "updatedAt:desc",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-results?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok)
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");

  const data = await response.json();

  const result = {
    ...data,
    data: data.data.map((examProblemResult: any) => {
      const newExamProblemResult: any = examProblemResult;
      newExamProblemResult["examProblemResultsCount"] =
        examProblemResult.exam_problem_results?.length;
      delete newExamProblemResult.exam_problem_results;

      return newExamProblemResult;
    }),
  };

  return result as ExamResultsWithCount;
}

export async function fetchExamResults(
  isSearching: boolean,
  debouncedSearchString: string,
  resultsPage: number,
  pageSize: number,
  setResultsMaxPage: (maxPage: number) => void,
) {
  let res;
  if (isSearching) {
    if (debouncedSearchString.trim().length > 0 && pageSize > 0) {
      res = await axios.get("/api/getExamResultsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: resultsPage,
          pageSize,
        },
      });
    }
  } else {
    if (debouncedSearchString.trim().length === 0 && pageSize > 0) {
      res = await axios.get("/api/getExamResults", {
        params: {
          page: resultsPage,
          pageSize,
        },
      });
    }
  }
  const data = res?.data;
  setResultsMaxPage(data.meta.pagination.pageCount || 1);
  return data;
}

export async function fetchProblemSets(
  isSearching: boolean,
  debouncedSearchString: string,
  problemSetsPage: number,
  pageSize: number,
  setProblemSetsMaxPage: (maxPage: number) => void,
) {
  let res;
  if (isSearching) {
    if (debouncedSearchString.trim().length > 0 && pageSize > 0) {
      res = await axios.get("/api/getProblemSetsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: problemSetsPage,
          pageSize,
        },
      });
    }
  } else {
    if (debouncedSearchString.trim().length === 0 && pageSize > 0) {
      res = await axios.get("/api/getProblemSets", {
        params: {
          page: problemSetsPage,
          pageSize,
        },
      });
    }
  }
  const data = res?.data;
  setProblemSetsMaxPage(data.meta.pagination.pageCount || 1);
  return data;
}

export async function getExamResultsMaxPage(
  isSearching: boolean,
  debouncedSearchString: string,
  pageSize: number,
) {
  let res;
  if (isSearching) {
    if (debouncedSearchString.trim().length > 0 && pageSize > 0) {
      res = await axios.get("/api/getExamResultsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: 1,
          pageSize,
        },
      });
    }
  } else {
    if (debouncedSearchString.trim().length === 0 && pageSize > 0) {
      res = await axios.get("/api/getExamResults", {
        params: {
          page: 1,
          pageSize,
        },
      });
    }
  }
  const data: ExamResultsResponse = res?.data;

  return data.meta.pagination.pageCount;
}

export async function getProblemSetsMaxPage(
  isSearching: boolean,
  debouncedSearchString: string,
  pageSize: number,
) {
  let res;
  if (isSearching) {
    if (debouncedSearchString.trim().length > 0 && pageSize > 0) {
      res = await axios.get("/api/getProblemSetsByName", {
        params: {
          name: debouncedSearchString.trim(),
          page: 1,
          pageSize,
        },
      });
    }
  } else {
    if (debouncedSearchString.trim().length === 0 && pageSize > 0) {
      res = await axios.get("/api/getProblemSets", {
        params: {
          page: 1,
          pageSize,
        },
      });
    }
  }
  const data: RawProblemSetResponse = res?.data;

  return data.meta.pagination.pageCount;
}
