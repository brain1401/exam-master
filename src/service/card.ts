import { Card, ProblemSetResponse } from "@/types/card";
import qs from "qs";
import { getUser } from "./user";

export const checkEnvVariables = () => {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};
export const isCardEmpty = (card: Card) => {
  if (!card) {
    return true;
  }
  if (card.question === "") {
    return true;
  }

  if (
    card.candidates &&
    card.candidates.some((candidate) => candidate.text === "")
  ) {
    return true;
  }
  if (card.isAdditiondalViewButtonClicked && card.additionalView === "") {
    return true;
  }

  if (card.isImageButtonClicked && card.image === null) {
    return true;
  }

  if (
    card.candidates &&
    !card.candidates?.some((candidate) => candidate.isAnswer === true)
  ) {
    return true;
  }

  if (card.type === "sub" && card.subAnswer === "") {
    return true;
  }

  return false;
};

export const isCardOnBeingWrited = (card: Card) => {
  if (!card) {
    return false;
  }
  if (card.question !== "") {
    return true;
  }

  if (
    card.candidates !== null &&
    card.candidates.some((candidate) => candidate.text !== "")
  ) {
    return true;
  }

  if (card.image !== null) {
    return true;
  }

  if (card.additionalView !== "") {
    return true;
  }

  if (card.type === "sub" && card.subAnswer !== "") {
    return true;
  }

  return false;
};

export async function createProblem(
  card: Card,
  userId: string
): Promise<string> {
  if (!card) {
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
          questionType: card.type,
          question: card.question,
          additionalView: card.additionalView,
          candidates: card.candidates,
          subjectiveAnswer: card.subAnswer,
          exam_users: {
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

export async function createImage(card: Card, postId: string) {
  if (!card) {
    return;
  }
  try {
    const newFormData = new FormData();
    newFormData.append("files", card.image as Blob);
    newFormData.append("ref", "api::exam-problem.exam-problem");
    newFormData.append("refId", postId);
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
          exam_users: {
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
  cards: Card[]
) {
  checkEnvVariables();
  const userId = (await getUser(userEmail)).id;

  // 각 카드에 대한 작업을 병렬로 수행
  const postIdArray = await Promise.all(
    cards.map(async (card) => {
      if (isCardEmpty(card)) throw new Error("문제가 비어있습니다.");

      // 문제와 이미지 생성은 순차적으로 처리
      const postId = await createProblem(card, userId);
      if (card?.image) {
        await createImage(card, postId);
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
      exam_users: {
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
      exam_users: {
        email: {
          $eq: userEmail,
        },
      },
    },
    pagination: {
      page,
      pageSize: 10,
    },
    sort: 'updatedAt:desc'
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

    const responseJson = await response.json();
    return responseJson as ProblemSetResponse;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}