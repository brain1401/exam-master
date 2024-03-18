import prisma from "@/lib/prisma";
import { PrismaTransaction } from "@/types/problems";

export async function createUserIfNotExists(
  email: string,
  name: string,
  image: string,
): Promise<boolean> {
  let result: boolean = false;
  const isUserExist = await checkUser(email);

  if (!isUserExist) {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          image,
        },
      });

      result = user ? true : false;
    } catch (err) {
      console.log(err);
      result = false;
    }
  } else {
    result = true;
  }
  return result;
}

export async function checkUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("checkUser user:", user)
    return user ? true : false;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}

export async function getUserByEmail(email: string, pm?: PrismaTransaction) {
  try {
    const prismaInstance = pm ?? prisma;

    const user = await prismaInstance.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new Error("유저를 찾을 수 없습니다.");
    return user;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 가져오는 중 오류가 발생했습니다.");
  }
}

export async function getUserByProblemUuId(problemUuid: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        problems: {
          some: {
            uuid: problemUuid,
          },
        },
      },
    });

    return user;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 가져오는 중 오류가 발생했습니다.");
  }
}

export async function getUserByImageUuId(
  imageUuid: string,
  pm?: PrismaTransaction,
) {
  try {
    const prismaInstance = pm ?? prisma;
    const user = await prismaInstance.user.findFirst({
      where: {
        images: {
          some: {
            uuid: imageUuid,
          },
        },
      },
    });
    return user;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 가져오는 중 오류가 발생했습니다.");
  }
}
