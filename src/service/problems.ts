import { ProblemSetResponse, Problem, ProblemSet } from "@/types/problems";
import qs from "qs";
import { getUser } from "./user";
import { link } from "fs";

export const checkEnvVariables = () => {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};

function isFileObject(image: any): image is File {
  return (
    image &&
    typeof image === "object" &&
    typeof image.name === "string" &&
    typeof image.size === "number" &&
    typeof image.type === "string" &&
    typeof image.lastModified === "number"
  );
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
  userId: string
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
          exam_user: {
            connect: [userId],
          },
        }),
      }
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
      }
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
  postIdArray: string[]
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
      }
    );
    if (!response.ok)
      throw new Error("문제를 업로드하는 중 오류가 발생했습니다.");

    return response.statusText;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 업로드하는 중 오류가 발생했습니다.");
  }
}

export async function postProblems(
  setName: string,
  userEmail: string,
  problems: Problem[]
) {
  checkEnvVariables();
  const userId = (await getUser(userEmail)).id;

  // 각 카드에 대한 작업을 병렬로 수행
  const postIdArray = await Promise.all(
    problems.map(async (problem) => {
      if (isProblemEmpty(problem)) throw new Error("문제가 비어있습니다.");

      // 문제와 이미지 생성은 순차적으로 처리
      const postId = await createProblem(problem, userId);
      if (problem?.image && isFileObject(problem?.image)) {
        await uploadImageToProblem(problem.image, postId);
      }

      return postId;
    })
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
      }
    );

    if (!response.ok)
      throw new Error("문제집 이름을 확인하는 중 오류가 발생했습니다.");

    const data = await response.json();
    console.log(data.data);

    return data.data.length === 0 ? false : true;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 이름을 확인하는 중 오류가 발생했습니다.");
  }
}

export async function getProblemSets(userEmail: string, page: string) {
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
      pageSize: 10,
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
      }
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let responseJson: ProblemSetResponse = await response.json();
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
  page: string
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
      pageSize: 10,
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
      }
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let responseJson: ProblemSetResponse = await response.json();
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
      }
    );

    if (!response.ok)
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");

    let data = await response.json();
    return data.data[0] as ProblemSet;
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
      }
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
      }
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
      }
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
      }),
    }
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
    }
  );
  if (!response.ok)
    throw new Error("이미지를 삭제하는 중 오류가 발생했습니다.");
}

export async function updatePhoto(image: File) {}

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
      }
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
  problemSetUUID: string
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
      body: JSON.stringify({
        name: name,
      }),
    }
  );
  if (!response.ok)
    throw new Error("문제집 이름을 수정하는 중 오류가 발생했습니다.");
}
export async function updateProblems(
  setName: string,
  problems: Problem[],
  problemSetUUID: string,
  userEmail: string
) {
  checkEnvVariables();

  console.log("problems", problems);
  console.log("setName", setName);

  const validatePrtoblemSetUUIDResult = await validateProblemSetUUID(
    problemSetUUID,
    userEmail
  );
  if (validatePrtoblemSetUUIDResult === "NO")
    throw new Error("유효하지 않은 문제집입니다.");

  //문제집 이름 수정
  await updateProblemSetName(setName, problemSetUUID);

  try {
    for (const problem of problems) {
      if (!problem?.id) {
        if (problem) {
          problem.id = Number(
            await createProblem(problem, (await getUser(userEmail)).id)
          );
        }

        if (problem?.id) {
          if (problem?.image && isFileObject(problem?.image)) {
            await uploadImageToProblem(problem.image, problem.id.toString());
          }
          await linkProblemToProblemSet(
            problem.id.toString(),
            (await getProblemsSetIdByUUID(problemSetUUID)).toString()
          );
          continue;
        }
      }

      if (!problem?.id) {
        throw new Error("문제를 수정하는 중 오류가 발생했습니다.");
      }

      if (problem && problem?.image && isFileObject(problem?.image)) {
        //image가 파일 타입인 경우
        const photoId = await getProblemPhotoIdByProblemId(
          problem.id.toString()
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
          problem.id.toString()
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

export async function validateProblemSetUUID(
  problemSetUUID: string,
  userEmail: string
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
      }
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
      }
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
  problemSetId: string
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
      body: JSON.stringify({
        exam_problem_sets: {
          connect: [problemSetId],
        },
      }),
    }
  );
  if (!response.ok)
    throw new Error("문제를 문제집에 연결하는 중 오류가 발생했습니다.");
}
