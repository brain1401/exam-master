import { Card } from "@/app/types/card";
import qs from "qs";
import axios from "axios";
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

export async function createProblem(card: Card, postedId: string[]):Promise<string> {
  try {
    // 문제 생성
    let postId = "";

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problems`,
      {
        questionType: card.type,
        question: card.question,
        additionalView: card.additionalView,
        candidates: card.candidates,
        subjectiveAnswer: card.subAnswer,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }
    );

    postId = response.data.data.id;
    postedId.push(postId);
    return postId;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function createImage(card: Card, postId: string){
   try {
     // 위에서 생성한 문제에 사진 넣기
     const newFormData = new FormData();
     newFormData.append("files", card.image as Blob);
     newFormData.append("ref", "api::exam-problem.exam-problem");
     newFormData.append("refId", postId);
     newFormData.append("field", "image");
     await axios.post(
       `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
       newFormData,
       {
         headers: {
           Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
           "Content-Type": "multipart/form-data",
         },
       }
     );
   } catch (err) {
     console.log(err);
     throw new Error("이미지를 생성하는 중 오류가 발생했습니다.");
   }
}

export async function createProblemSets(userEmail: string, setName: string, postIdArray: string[]) {
    try {
      const user = await getUser(userEmail);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-problem-sets`,
        {
          name: setName,
          exam_problems: {
            connect: [...postIdArray],
          },
          exam_users: {
            connect: [user.id],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          },
        }
      );

      return response.data.data;
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
    if (isCardEmpty(card)) {
      throw new Error("문제가 비어있습니다.");
    }

    let postId = await createProblem(card, postIdArray);
    card.image && await createImage(card, postId);

  }
  console.log("postedId :",postIdArray);

  const response = await createProblemSets(userEmail, setName, postIdArray);
  return response;

}
