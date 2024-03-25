import drizzleSession from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {
  user as userTable,
  problem as problemTable,
  image as imageTable,
} from "@/db/schema";
import { DrizzleTransaction } from "@/types/problems";

export async function createUser(
  email: string,
  name: string,
  image: string,
): Promise<boolean> {
  let result: boolean = false;

  try {
    const user = await drizzleSession
      .insert(userTable)
      .values({
        email,
        name,
        image,
        updatedAt: new Date(),
      })
      .returning();

    result = user.length > 0 ? true : false;
  } catch (err) {
    console.log(err);
    result = false;
  }

  return result;
}

export async function checkUser(email: string) {
  try {
    const user = await drizzleSession.query.user.findFirst({
      where: eq(userTable.email, email),
    });

    return user ? true : false;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}

export async function getUserUUIDbyEmail(
  email: string,
  dt: DrizzleTransaction,
) {
  try {
    const user = await getUserByEmail(email, dt);
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    return user.uuid;
  } catch (err) {
    console.log(err);
    throw new Error("유저를 찾는 중 오류가 발생했습니다.");
  }
}

export async function getUserByEmail(email: string, dt?: DrizzleTransaction) {
  try {
    const drizzle = dt ?? drizzleSession;

    const user = await drizzle.query.user.findFirst({
      where: eq(userTable.email, email),
    });

    return user ?? null;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 가져오는 중 오류가 발생했습니다.");
  }
}

export async function getUserByProblemUuId(
  problemUuid: string,
  dt?: DrizzleTransaction,
) {
  const drizzle = dt ?? drizzleSession;
  try {
    const user = await drizzle.query.user.findFirst({
      where: eq(problemTable.uuid, problemUuid),
    });
    return user ?? null;
  } catch (err) {
    console.log(err);

    throw new Error("유저를 가져오는 중 오류가 발생했습니다.");
  }
}