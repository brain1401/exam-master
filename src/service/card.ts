import { Card } from "@/app/types/card";
import qs from "qs";
import { getUser } from "./user";

export const checkEnvVariables = () => {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};
export const isCardEmpty = (card: Card) => {
  if (card.question === "") {
    console.log("question is empty");
    return true;
  }

  if (
    card.candidates &&
    card.candidates.some((candidate) => candidate.text === "")
  ) {
    console.log("candidate is empty");
    return true;
  }

  if (
    card.candidates &&
    !card.candidates?.some((candidate) => candidate.isAnswer === true)
  ) {
    console.log("answer is empty");
    return true;
  }

  if (card.type === "sub" && card.subAnswer === "") {
    console.log("subAnswer is empty");
    return true;
  }

  return false;
};

export const isCardOnBeingWrited = (card: Card) => {
  if (card.question !== "") {
    console.log("question is not empty");
    return true;
  }

  if (
    card.candidates !== null &&
    card.candidates.some((candidate) => candidate.text !== "")
  ) {
    console.log("candidate is not empty");
    return true;
  }

  if (card.image !== null) {
    console.log("image is not empty");
    return true;
  }

  if (card.additionalView !== "") {
    console.log("additionalView is not empty");
    return true;
  }

  if (card.type === "sub" && card.subAnswer !== "") {
    console.log("subAnswer is not empty");
    return true;
  }

  return false;
};

export async function createProblem(card: Card): Promise<string> {
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
  userEmail: string,
  setName: string,
  postIdArray: string[]
) {
  try {
    const user = await getUser(userEmail);

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
            connect: [user.id],
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
  const postIdArray: string[] = [];

  for (const card of cards) {
    if (isCardEmpty(card)) throw new Error("문제가 비어있습니다.");

    const postId = await createProblem(card);
    postIdArray.push(postId);

    card.image && (await createImage(card, postId));
  }

  const response = await createProblemSets(userEmail, setName, postIdArray);
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
