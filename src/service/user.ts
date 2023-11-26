import axios from "axios";
import qs from "qs";

export async function createUserIfNotExists(
  email: string,
  name: string,
  image: string
): Promise<boolean> {
  let result: boolean = false;
  const isUserExist = await checkUser(email);

  if (!isUserExist) {
    if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
      throw new Error("환경 변수가 설정되지 않았습니다.");
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-users`,
        {
          email,
          name,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          },
        }
      );
      result = true;
    } catch (err) {
      console.log(err);
      result = false;
    }
  }
  else{
    result = true;
  }
  return result;
}

export async function checkUser(email: string) {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }

  const query = qs.stringify({
    filters: {
      email: {
        $eq: email,
      },
    },
  });

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-users?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }
    );

    const user = Boolean(response.data.data[0]);

    return user;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}

export async function getUser(email: string) {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_TOKEN) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }

  const query = qs.stringify({
    filters: {
      email: {
        $eq: email,
      },
    },
  });

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exam-users?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
      }
    );

    const user = response.data.data[0];

    return user;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 가져오는 중 오류가 발생했습니다.");
  }
}
