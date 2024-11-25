import drizzleSession from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import {
  user as userTable,
  problem as problemTable,
  generationCount as generationCountTable,
} from "@/db/schema";
import { DrizzleTransaction } from "@/types/problems";
import { startOfWeek } from "date-fns";
import { MAX_GENERATION_COUNT_PER_WEEK } from "@/const/generationCount";

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
  dt?: DrizzleTransaction,
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

/**
 * 사용자가 문제를 생성할 수 있는지 확인합니다.
 *
 * @param {string} email - 확인할 사용자의 이메일 주소
 * @returns {Promise<boolean>} 사용자가 문제를 더 생성할 수 있으면 true, 그렇지 않으면 false를 반환합니다.
 * @throws {Error} 사용자를 찾을 수 없거나 데이터베이스 조회 중 오류가 발생한 경우
 *
 * @description
 * 이 함수는 주어진 이메일 주소의 사용자가 이번 주에 생성한 문제의 수를 확인합니다.
 * 생성 횟수가 MAX_GENERATION_COUNT_PER_WEEK 미만이면 true를 반환하고, 그렇지 않으면 false를 반환합니다.
 * 주의 시작은 월요일(weekStartsOn: 1)을 기준으로 합니다.
 */

export async function canUserGenerateProblemSet(
  email: string,
): Promise<boolean> {
  try {
    return await drizzleSession.transaction(async (tx) => {
      const userRecord = await getUserByEmail(email, tx);

      if (!userRecord) throw new Error("User not found");

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

      const [record] = await tx
        .select()
        .from(generationCountTable)
        .where(
          and(
            eq(generationCountTable.userUuid, userRecord.uuid),
            eq(generationCountTable.weekStart, weekStart),
          ),
        );

      if (!record) return true;

      return record.count < MAX_GENERATION_COUNT_PER_WEEK;
    });
  } catch (err) {
    console.error(err);
    throw new Error("생성 제한을 확인하는 중 오류가 발생했습니다.");
  }
}

export async function incrementGenerationCount(email: string) {
  try {
    await drizzleSession.transaction(async (tx) => {
      const userRecord = await getUserByEmail(email, tx);

      if (!userRecord) throw new Error("User not found");

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

      const [record] = await tx
        .select()
        .from(generationCountTable)
        .where(
          and(
            eq(generationCountTable.userUuid, userRecord.uuid),
            eq(generationCountTable.weekStart, weekStart),
          ),
        );

      if (!record) {
        await tx.insert(generationCountTable).values({
          userUuid: userRecord.uuid,
          count: 1,
          weekStart,
        });
      } else {
        await tx
          .update(generationCountTable)
          .set({ count: record.count + 1 })
          .where(eq(generationCountTable.uuid, record.uuid));
      }
    });
  } catch (err) {
    console.error(err);
    throw new Error("생성 카운트를 증가시키는 중 오류가 발생했습니다.");
  }
}

export async function getGenerationCount(email: string) {
  try {
    const userRecord = await getUserByEmail(email);

    if (!userRecord) throw new Error("User not found");

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const [record] = await drizzleSession.query.generationCount.findMany({
      where: and(
        eq(generationCountTable.userUuid, userRecord.uuid),
        eq(generationCountTable.weekStart, weekStart),
      ),
    });

    return record?.count ?? 0;
  } catch (err) {
    console.error(err);
    throw new Error("생성 카운트를 가져오는 중 오류가 발생했습니다.");
  }
}
