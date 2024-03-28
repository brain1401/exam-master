import "server-only";

import {
  ExamProblem,
  ProblemSetWithPagination,
  Candidate,
  DrizzleTransaction,
  ResultsWithPagination,
  problemsSchema,
  ProblemReplacedImageKey,
  PublicProblemSetWithPagination,
} from "@/types/problems";
import { getUserUUIDbyEmail } from "./user";
import {
  analyzeProblemsImagesAndDoCallback,
  generateFileHash,
  isAnswerArray,
  isAnswerString,
  isAnsweredMoreThanOne,
  isImageUrlObject,
  isProblemAsnwered,
} from "@/utils/problems";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  isNull,
  isNotNull,
  between,
  notBetween,
  like,
  ilike,
  notLike,
  not,
  and,
  or,
  inArray,
  notInArray,
  count,
  desc,
  asc,
} from "drizzle-orm";

import {
  user,
  image,
  problem,
  result,
  problemSet,
  problemResult,
  likedProblemSets,
  imageToUser,
} from "@/db/schema";

import { s3Client } from "@/utils/AWSs3Client";
import drizzleSession from "@/db/drizzle";

export async function postProblems({
  problemSetName,
  toBePostedProblems,
  userEmail,
  isPublic,
  isShareLinkPurposeSet,
  description,
}: {
  problemSetName: string;
  userEmail: string;
  toBePostedProblems: ProblemReplacedImageKey[];
  isShareLinkPurposeSet: boolean;
  isPublic: boolean;
  description?: string;
}) {
  try {
    const result = await drizzleSession.transaction(async (dt) => {
      const createdImages = await analyzeProblemsImagesAndDoCallback({
        problems: toBePostedProblems,
        flatResult: true,
        skipDuplicated: true,
        callback: async ({
          index,
          isNoImage,
          duplicateIndexes,
          isFirstImage,
          imageKey,
          toBeCallbacked,
        }) => {
          if (!isNoImage && isFirstImage) {
            // 이미지가 있으면서 배열 내 처음 이미지인 경우
            if (imageKey) {
              const uuid = await createImageOnDBIfNotExistByS3Key(
                imageKey,
                userEmail,
                dt,
              );

              if (duplicateIndexes.length > 0) {
                const result = duplicateIndexes.map((i) => {
                  const imageKey = toBeCallbacked[i].imageKey;
                  if (!imageKey) throw new Error("이미지가 올바르지 않습니다.");
                  return {
                    index: i,
                    uuid: uuid,
                  };
                });
                return result;
              }
              return {
                index,
                uuid,
              };
            }
          }

          return {
            index,
            uuid: null,
          };
        },
      });

      console.log(
        "createdImages :",
        createdImages.toSorted((a, b) => a.index - b.index),
      );

      const userUuId = await getUserUUIDbyEmail(userEmail, dt);

      // 문제집 생성
      const [createdProblemSet] = await dt
        .insert(problemSet)
        .values({
          name: problemSetName,
          userUuid: userUuId,
          isShareLinkPurposeSet: isShareLinkPurposeSet,
          updatedAt: new Date(),
          description,
          isPublic,
        })
        .returning({ uuid: problemSet.uuid });

      if (!createdProblemSet) throw new Error("문제집 생성 중 오류 발생");

      // 문제들 생성
      await Promise.all(
        toBePostedProblems.map(async (toBePostedProblem, index) => {
          if (!toBePostedProblem) throw new Error("문제가 null입니다!");
          const currentImageUuid = createdImages.find(
            (image) => image?.index === index,
          )?.uuid;
          await dt.insert(problem).values({
            order: index + 1,
            question: toBePostedProblem.question,
            questionType: toBePostedProblem.type,
            candidates: toBePostedProblem.candidates ?? undefined,
            additionalView: toBePostedProblem.additionalView,
            subjectiveAnswer: toBePostedProblem.subAnswer,
            isAnswerMultiple: toBePostedProblem.isAnswerMultiple ?? undefined,
            imageUuid: currentImageUuid ?? undefined,
            userUuid: userUuId,
            problemSetUuid: createdProblemSet.uuid,
          });
        }),
      );

      return createdProblemSet ? "OK" : "FAIL";
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function updateProblems({
  problemSetName,
  replacingProblems,
  problemSetUUID,
  description,
  problemSetIsPublic,
  userEmail,
}: {
  problemSetName: string;
  replacingProblems: ProblemReplacedImageKey[];
  problemSetUUID: string;
  description: string | undefined;
  problemSetIsPublic: boolean;
  userEmail: string;
}) {
  console.log("문제 업데이트 시작!");

  try {
    console.log("문제 업데이트 트랜잭션 시작");
    const result = await drizzleSession.transaction(async (dt) => {
      console.log("기존 문제 불러오기 시작");

      const oldProblems = await dt.query.problem.findMany({
        where: eq(problem.problemSetUuid, problemSetUUID),
        with: {
          image: true,
        },
        columns: {
          uuid: true,
          order: true,
        },
      });

      console.log(
        "oldProblems : ",
        oldProblems.sort((a, b) => a.order - b.order),
      );

      const createdImages = await analyzeProblemsImagesAndDoCallback({
        problems: replacingProblems,
        flatResult: true,
        skipDuplicated: true,
        callback: async ({
          index,
          isNoImage,
          duplicateIndexes,
          isFirstImage,
          imageKey,
          toBeCallbacked,
        }) => {
          if (!isNoImage && isFirstImage) {
            // 이미지가 있으면서 배열 내 처음 이미지인 경우
            if (imageKey) {
              const uuid = await createImageOnDBIfNotExistByS3Key(
                imageKey,
                userEmail,
                dt,
              );

              if (duplicateIndexes && duplicateIndexes.length > 0) {
                const result = duplicateIndexes.map((i) => {
                  const imageKey = toBeCallbacked[i].imageKey;
                  if (!imageKey) throw new Error("이미지가 올바르지 않습니다.");
                  return {
                    index: i,
                    uuid: uuid,
                  };
                });
                return result;
              }
              return {
                index,
                uuid,
              };
            }
          }

          return {
            index,
            uuid: null,
          };
        },
      });

      console.log(
        "createdImages :",
        createdImages.toSorted((a, b) => a.index - b.index),
      );
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const newProblems = await Promise.all(
        replacingProblems.map(async (replacingProblem, index) => {
          if (!replacingProblem) throw new Error("문제가 null입니다!");

          console.log(`문제 ${index + 1} 생성 시작`);

          const currentImageUuid = createdImages.find(
            (image) => image?.index === index,
          )?.uuid;

          const [createdProblem] = await dt
            .insert(problem)
            .values({
              order: index + 1,
              question: replacingProblem.question,
              questionType: replacingProblem.type,
              candidates: replacingProblem.candidates ?? undefined,
              additionalView: replacingProblem.additionalView,
              subjectiveAnswer: replacingProblem.subAnswer,
              isAnswerMultiple: replacingProblem.isAnswerMultiple ?? undefined,
              imageUuid: currentImageUuid ?? undefined,
              userUuid: userUuid,
              problemSetUuid: problemSetUUID,
            })
            .returning({ uuid: problem.uuid });

          const result = await dt.query.problem.findFirst({
            where: eq(problem.uuid, createdProblem.uuid),
            with: {
              image: true,
            },
          });

          if (!result) {
            throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
          }

          console.log(`문제 ${index + 1} 생성 완료`);
          return result;
        }),
      );

      console.log("newProblems : ", newProblems);

      console.log(`기존 문제들 삭제 시작`);

      //삭제할 이미지 키 중복 제거
      const toBeDeletedImageKey = [
        ...new Set(
          oldProblems.reduce((acc, cur) => {
            if (cur.image) acc.push(cur.image.key);
            return acc;
          }, [] as string[]),
        ),
      ]
        .reduce((acc, cur) => {
          const newProblemsImageKey = newProblems.reduce((acc, cur) => {
            if (cur.image) acc.push(cur.image.key);
            return acc;
          }, [] as string[]);

          if (!newProblemsImageKey.includes(cur)) acc.push(cur);
          return acc;
        }, [] as string[])
        .map((key) => ({ key, problemSetCount: 1 }));

      console.log("toBeDeletedImageKey : ", toBeDeletedImageKey);

      if (toBeDeletedImageKey.length > 0) {
        await deleteImagesFromSet(toBeDeletedImageKey, userEmail, dt);
      }

      await Promise.all([
        // 문제집 이름 및 공개 여부 업데이트
        dt
          .update(problemSet)
          .set({ name: problemSetName })
          .where(eq(problemSet.uuid, problemSetUUID)),
        dt
          .update(problemSet)
          .set({ isPublic: problemSetIsPublic })
          .where(eq(problemSet.uuid, problemSetUUID)),
        dt
          .update(problemSet)
          .set({ description: description })
          .where(eq(problemSet.uuid, problemSetUUID)),
      ]);

      if (oldProblems.length > 0) {
        console.log(`기존 문제들 삭제 시작`, oldProblems);

        // 기존 문제 삭제
        await Promise.all(
          oldProblems.map(async (oldProblem) => {
            await dt.delete(problem).where(eq(problem.uuid, oldProblem.uuid));
          }),
        );
      }

      console.log("기존 문제 삭제 완료");
      return true;
    });

    return result;
  } catch (err) {
    console.error("오류 발생:", err);
    throw new Error("문제 업데이트 중 오류 발생");
  }
}

export async function createImageOnDBIfNotExistByS3Key(
  imageKey: string,
  userEmail: string,
  dt: DrizzleTransaction,
) {
  console.log("createImageIfNotExist 함수 시작");

  try {
    if (imageKey) {
      const imageUuid = await getImageUuidOnDBByImageKey(imageKey, dt);
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      if (imageUuid) {
        // 이미지가 DB에 이미 존재하는 경우

        await dt
          .insert(imageToUser)
          .values({
            imageUuid: imageUuid,
            userUuid: userUuid,
          })
          .onConflictDoNothing();

        return imageUuid;
      } else {
        // 이미지가 DB에 존재하지 않는 경우 ( 생성 )
        const file = await getImageFileOnS3ByImageKey(imageKey);
        const hash = await generateFileHash(file);

        const images = await dt
          .insert(image)
          .values({
            filename: extractFileName(imageKey),
            hash: hash,
            url: `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${encodeURIComponent(imageKey)}`,
            key: imageKey,
          })
          .returning({ uuid: image.uuid })
          .onConflictDoNothing();

        if (images.length > 0) {
          // insert가 성공한 경우
          const imageUuid = images[0].uuid;

          await dt.insert(imageToUser).values({
            imageUuid: imageUuid,
            userUuid: userUuid,
          });

          return imageUuid;
        }
      }
    } else {
      throw new Error("이미지가 올바르지 않습니다.");
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      "[createImageIfNotExist] 이미지를 생성하는 중 오류가 발생했습니다.",
    );
  }
}

export async function checkProblemSetName(name: string, userEmail: string) {
  try {
    const result = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      const result = await drizzleSession.query.problemSet.findFirst({
        where: and(
          eq(problemSet.name, name),
          eq(problemSet.userUuid, userUuid),
        ),
      });

      return result ? true : false;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 이름을 확인하는 중 오류가 발생했습니다.");
  }
}

export async function checkIfImageExistsOnDBByImageKey(
  imageKey: string,
  dt?: DrizzleTransaction,
) {
  const drizzle = dt ?? drizzleSession;
  try {
    const result = await drizzle.query.image.findFirst({
      where: eq(image.key, imageKey),
    });

    return result ? true : false;
  } catch (err) {
    console.log(err);
    throw new Error("이미지를 확인하는 중 오류가 발생했습니다.");
  }
}

export async function checkIfImageExistsOnS3ByImageKey(imageKey: string) {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
      }),
    );

    return true;
  } catch (err) {
    return false;
  }
}
export async function getProblemSets(
  userEmail: string,
  page: string,
  pageSize: string,
) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const [[{ value: totalProblemSetsCount }], problemSets] =
        await Promise.all([
          drizzleSession
            .select({ value: count() })
            .from(problemSet)
            .where(eq(problemSet.userUuid, userUuid)),
          dt.query.problemSet.findMany({
            where: eq(problemSet.userUuid, userUuid),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
            with: {
              problems: {
                orderBy: (problem, { asc }) => [asc(problem.order)],
                with: {
                  image: true,
                },
              },
            },
          }),
        ]);

      const returnData: ProblemSetWithPagination = {
        data: problemSets.map((problemSet) => ({
          uuid: problemSet.uuid,
          name: problemSet.name,
          createdAt: problemSet.createdAt,
          updatedAt: problemSet.updatedAt,
          isShareLinkPurposeSet: problemSet.isShareLinkPurposeSet,
          examProblemsCount: problemSet.problems.length,
        })),
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(totalProblemSetsCount / parseInt(pageSize)),
          total: problemSets.length,
        },
      };

      return returnData;
    });
    return data;
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
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const problemSets = await dt.query.problemSet.findMany({
        where: (problemSet, { like, and, eq }) =>
          and(
            like(problemSet.name, `%${name}%`),
            eq(problemSet.userUuid, userUuid),
          ),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize),
        orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
        with: {
          problems: {
            orderBy: (problem, { asc }) => [asc(problem.order)],
            with: {
              image: true,
            },
          },
        },
      });

      const returnData: ProblemSetWithPagination = {
        data: problemSets.map((problemSet) => ({
          uuid: problemSet.uuid,
          name: problemSet.name,
          createdAt: problemSet.createdAt,
          updatedAt: problemSet.updatedAt,
          isShareLinkPurposeSet: problemSet.isShareLinkPurposeSet,
          examProblemsCount: problemSet.problems.length,
        })),
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(problemSets.length / parseInt(pageSize)),
          total: problemSets.length,
        },
      };

      return returnData;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemsSetByUUID(uuid: string, userEmail: string) {
  // filter 조건에 userEmail을 추가해서 해당 유저의 문제집만 가져오도록 했음

  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const foundProblemSet = await dt.query.problemSet.findFirst({
        where: (problemSet, { eq, and }) =>
          and(eq(problemSet.uuid, uuid), eq(problemSet.userUuid, userUuid)),
        with: {
          problems: {
            orderBy: (problem, { asc }) => [asc(problem.order)],
            with: {
              image: true,
            },
          },
        },
      });

      if (!foundProblemSet) throw new Error("문제집을 찾을 수 없습니다.");

      const returnData = {
        uuid: foundProblemSet.uuid,
        name: foundProblemSet.name,
        createdAt: foundProblemSet.createdAt,
        updatedAt: foundProblemSet.updatedAt,
        isShareLinkPurposeSet: foundProblemSet.isShareLinkPurposeSet,
        isPublic: foundProblemSet.isPublic,
        problems: foundProblemSet.problems.map((problem) => ({
          uuid: problem.uuid,
          question: problem.question,
          additionalView: problem.additionalView ?? "",
          candidates: problem.candidates as Candidate[],
          image: problem.image,
          isAdditiondalViewButtonClicked: problem.additionalView ? true : false,
          isAnswerMultiple: problem.isAnswerMultiple,
          isImageButtonClicked: problem.image ? true : false,
          subjectiveAnswer: problem.subjectiveAnswer,
          subAnswer: problem.subjectiveAnswer,
          type: problem.questionType as "obj" | "sub",
        })),
      };

      return returnData;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getImageUuidOnDBByImageKey(
  imageKey: string,
  dt: DrizzleTransaction,
) {
  try {
    const drizzle = dt ?? drizzleSession;

    const result = await drizzle.query.image.findFirst({
      where: eq(image.key, imageKey),
      columns: {
        uuid: true,
      },
    });
    return result ? result.uuid : null;
  } catch (err) {
    console.error("오류 발생:", err);
    throw new Error("이미지 uuid를 찾는 중 오류 발생");
  }
}

function extractFileName(text: string): string {
  // '-'를 구분자로 사용하여 문자열을 분할
  const parts = text.split("-");
  // 해시 부분을 제외하고 파일 이름 부분만 조합하여 반환
  return parts.slice(1).join("-");
}

export async function getImageFileOnS3ByImageKey(imageKey: string) {
  try {
    console.log("getImageFileOnS3ByImageKey 함수 시작");
    console.log("imageKey :", imageKey);
    const result = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
      }),
    );

    const imageFile = new File(
      [await result.Body?.transformToByteArray()!],
      extractFileName(imageKey),
      {
        type: result.ContentType,
      },
    );

    return imageFile;
  } catch (error) {
    console.error("Error creating File from image URL:", error);
    throw error;
  }
}

export async function checkUserPermissionForProblemSet(
  problemSetUUID: string,
  userEmail: string,
) {
  try {
    const result = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      const result = await drizzleSession.query.problemSet.findFirst({
        where: and(
          eq(problemSet.uuid, problemSetUUID),
          eq(problemSet.userUuid, userUuid),
        ),
      });

      return result ? "OK" : "NO";
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}

export async function getAnswerByProblemUuid(
  problemUuid: string,
  dt?: DrizzleTransaction,
) {
  const drizzle = dt ?? drizzleSession;
  try {
    const problem = await drizzle.query.problem.findFirst({
      where: (problem, { eq }) => eq(problem.uuid, problemUuid),
      columns: {
        questionType: true,
        candidates: true,
        subjectiveAnswer: true,
      },
    });

    if (!problem) throw new Error("문제를 불러오는 중 오류가 발생했습니다.");

    const answer =
      problem.questionType === "obj" && isCandidateArray(problem.candidates)
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

export function isCandidateArray(candidates: any): candidates is Candidate[] {
  return (
    Array.isArray(candidates) &&
    candidates.every((candidate) => {
      return (
        typeof candidate === "object" &&
        candidate.id !== undefined &&
        candidate.text !== undefined &&
        candidate.isAnswer !== undefined
      );
    })
  );
}

function stringToBoolean(value: string): boolean {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
  throw new Error("Invalid input");
}

type ProblemsAndSetName = {
  problemSetName: string;
  problemSetIsPublic: boolean;
  description?: string;
  problems: ProblemReplacedImageKey[];
};

type ProblemsAndSetsNameWithUUID = ProblemsAndSetName & {
  problemSetUUID: string;
};

export function getParsedProblems<T extends boolean>(
  formData: FormData,
  includeUuid: T,
): T extends true ? ProblemsAndSetsNameWithUUID : ProblemsAndSetName {
  const entries = Array.from(formData.entries());

  const problems: NonNullable<ProblemReplacedImageKey>[] = [];
  let problemSetName: string | undefined;
  let problemSetUUID: string | undefined;
  let problemSetIsPublic: boolean | undefined;
  let description: string | undefined;

  for (const [name, value] of entries) {
    if (name === "problemSetsName") {
      problemSetName = value as string;
      continue;
    }
    if (name === "problemSetIsPublic") {
      problemSetIsPublic = stringToBoolean(value.toString());
      continue;
    }
    if (name === "description") {
      description = value as string;
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

      if (problems[index] === undefined) {
        problems[index] =
          problems[index] ?? ({} as NonNullable<ProblemReplacedImageKey>);
      }

      if (prefix === "data") {
        const ProblemData = JSON.parse(value as string);
        problems[index] = {
          ...ProblemData,
          ...problems[index],
        };
      } else if (prefix === "image") {
        if (typeof value === "string") {
          problems[index].image = value === "null" ? null : { key: value };
        } else {
          throw new Error("이미지가 올바르지 않습니다.");
        }
      }
    }
  }

  if (includeUuid) {
    return {
      problemSetName,
      problems,
      problemSetIsPublic,
      description,
      problemSetUUID,
    } as T extends true ? ProblemsAndSetsNameWithUUID : ProblemsAndSetName;
  } else {
    return {
      problemSetName,
      problems,
      description,
      problemSetIsPublic,
    } as T extends true ? ProblemsAndSetsNameWithUUID : ProblemsAndSetName;
  }
}

export async function postProblemResult(
  order: number,
  problem: ExamProblem,
  resultsUuid: string,
  result: boolean,
  answer: string | (number | null)[],
  userUuid: string,
  dt: DrizzleTransaction,
) {
  if (!problem || !problem.uuid) throw new Error("something is null");

  try {
    const createdProblemResult = await dt
      .insert(problemResult)
      .values({
        order: order,
        resultUuid: resultsUuid,
        isCorrect: result,
        userUuId: userUuid,
        candidates: problem.candidates
          ? problem.candidates.map((candidate) => ({
              id: candidate.id,
              text: candidate.text,
              isSelected: candidate.isAnswer,
            }))
          : undefined,
        subjectiveAnswered: problem.subAnswer,
        question: problem.question,
        additionalView: problem.additionalView ?? null,
        questionType: problem.type,
        isAnswerMultiple: problem.isAnswerMultiple ?? false,
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
          : undefined,
        correctSubjectiveAnswer: isAnswerString(answer) ? answer : null,
        imageUuid: isImageUrlObject(problem.image)
          ? problem.image.uuid
          : undefined,
        updatedAt: new Date(),
      })
      .returning({ uuid: problemResult.uuid });

    if (!createdProblemResult)
      throw new Error("문제 결과를 생성하는 중 오류가 발생했습니다.");
  } catch (err) {
    console.log(err);
    throw new Error("문제 결과를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function getExamResultsByUUID(
  resultUuid: string,
  userEmail: string,
) {
  try {
    const result = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const result = await dt.query.result.findFirst({
        where: (result, { eq, and }) =>
          and(eq(result.uuid, resultUuid), eq(result.userUuid, userUuid)),
        with: {
          problemResults: {
            orderBy: (problemResult, { asc }) => [asc(problemResult.order)],
            with: {
              image: true,
            },
          },
        },
      });

      return result;
    });

    if (!result)
      throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getExamResults(
  userEmail: string,
  page: string,
  pageSize: string,
  dt: DrizzleTransaction,
) {
  try {
    const userUuid = await getUserUUIDbyEmail(userEmail, dt);

    const [[{ value: totalExamResultsCount }], examResults] = await Promise.all(
      [
        dt
          .select({ value: count() })
          .from(result)
          .where(eq(result.userUuid, userUuid)),
        dt.query.result.findMany({
          where: eq(result.userUuid, userUuid),
          offset: (parseInt(page) - 1) * parseInt(pageSize),
          limit: parseInt(pageSize),
          orderBy: (result, { desc }) => [desc(result.updatedAt)],
          with: {
            problemResults: {
              orderBy: (problemResult, { asc }) => [asc(problemResult.order)],
              with: {
                image: true,
              },
            },
          },
        }),
      ],
    );

    const finalResult: ResultsWithPagination = {
      data: examResults.map((examResult) => ({
        uuid: examResult.uuid,
        problemResultsCount: examResult.problemResults.length,
        problemSetName: examResult.problemSetName,
        createdAt: examResult.createdAt,
        updatedAt: examResult.updatedAt,
      })),
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        pageCount: Math.ceil(totalExamResultsCount / parseInt(pageSize)),
        total: examResults.length,
      },
    };

    return finalResult;
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
  try {
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      const [[{ value: totalExamResultsCount }], examResults] =
        await Promise.all([
          dt
            .select({ value: count() })
            .from(result)
            .where(
              and(
                eq(result.userUuid, userUuid),
                like(result.problemSetName, `%${name}%`),
              ),
            ),
          dt.query.result.findMany({
            where: (result, { and, like }) =>
              and(
                like(result.problemSetName, `%${name}%`),
                eq(result.userUuid, userUuid),
              ),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            orderBy: (result, { desc }) => [desc(result.updatedAt)],
            with: {
              problemResults: {
                orderBy: (problemResult, { asc }) => [asc(problemResult.order)],
                with: {
                  image: true,
                },
              },
            },
          }),
        ]);

      const finalResult: ResultsWithPagination = {
        data: examResults.map((examResult) => ({
          uuid: examResult.uuid,
          problemResultsCount: examResult.problemResults.length,
          problemSetName: examResult.problemSetName,
          createdAt: examResult.createdAt,
          updatedAt: examResult.updatedAt,
        })),
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(totalExamResultsCount / parseInt(pageSize)),
          total: examResults.length,
        },
      };

      return finalResult;
    });

    return transactionResult;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function deleteImagesFromSet(
  toBeDeletedImages: {
    key: string;
    problemSetCount: number;
  }[],
  userEmail: string,
  dt: DrizzleTransaction,
) {
  let problemFileImages: ({ imageFile: File; imageKey: string } | null)[] = [];
  const s3 = s3Client;
  const userUuid = await getUserUUIDbyEmail(userEmail, dt);

  console.log("[deleteImagesFromSet] 이미지 삭제 시작");

  try {
    // 삭제 실패에 대비하여 이미지 파일 복사
    console.time("이미지 삭제 실패 대비 이미지 복사 시간");
    problemFileImages = await Promise.all(
      toBeDeletedImages.map(async (image) => {
        if (!image) return null;
        return {
          imageFile: await getImageFileOnS3ByImageKey(image.key),
          imageKey: image.key,
        };
      }),
    );
    console.timeEnd("이미지 삭제 실패 대비 이미지 복사 시간");

    // 이미지가 다른곳에서 참조되는지 확인하고 참조가 없으면 삭제
    await Promise.all(
      toBeDeletedImages.map(async (toBeDeletedImage) => {
        if (toBeDeletedImage) {
          const totalReference = await getReferecesOfImageByImageKey(
            toBeDeletedImage.key,
            dt,
          );

          console.log(
            `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key}\ntotalReference :`,
            totalReference,
          );

          const imageUuid = await getImageUuidOnDBByImageKey(
            toBeDeletedImage.key,
            dt,
          );

          if (!imageUuid)
            throw new Error("이미지 uuid를 찾는 중 오류가 발생했습니다.");

          const currentUserImageReference = totalReference.users.find(
            (user) => user.userEmail === userEmail,
          )?.count.total;

          if (!currentUserImageReference)
            throw new Error(
              "[deleteImagesFromSet] currentUserImageReference이 undefind입니다.",
            );

          console.log(
            `\n[${toBeDeletedImage.key}]\nif(totalRefercence.allUserCount.total) === toBeDeletedImage.problemSetCount\nif(${totalReference.allUserCount.total} === ${toBeDeletedImage.problemSetCount})`,
          );

          if (
            totalReference.allUserCount.total ===
            toBeDeletedImage.problemSetCount
          ) {
            // 삭제할 이미지의 모든 유저의 이미지 참조가 삭제할 이미지의 세트 숫자만큼인 경우 s3에서 이미지 삭제 (s3 삭제 대상)
            console.log(
              `[deleteImagesFromSet] 참조가 없어 이미지 ${toBeDeletedImage.key} 삭제 시작`,
            );

            const command = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: toBeDeletedImage.key,
            });

            const response = await s3.send(command);
            if (!(response.$metadata.httpStatusCode === 204))
              throw new Error(
                "S3에서 이미지를 삭제하는 중 오류가 발생했습니다.",
              );
            console.log(
              `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key} s3에서 삭제 성공`,
            );

            await dt.delete(image).where(eq(image.uuid, imageUuid));

            console.log(
              `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key} image 테이블에서 삭제 성공`,
            );

            console.log(
              `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key} 삭제 성공`,
            );
          }

          console.log(
            `\n[${toBeDeletedImage.key}]\nif(currentUserImageReference) === toBeDeletedImage.problemSetCount\nif(${currentUserImageReference} === ${toBeDeletedImage.problemSetCount})`,
          );

          if (currentUserImageReference === toBeDeletedImage.problemSetCount) {
            // 삭제할 이미지의 현재 유저의 이미지 참조가 삭제할 이미지의 세트 숫자만큼인 경우 user 테이블에서 이미지 참조 삭제

            console.log(
              `[deleteImagesFromSet] user테이블에서 image ${toBeDeletedImage.key}연결 해제 시작`,
            );

            await dt
              .delete(imageToUser)
              .where(
                and(
                  eq(imageToUser.imageUuid, imageUuid),
                  eq(imageToUser.userUuid, userUuid),
                ),
              );

            console.log(
              `[deleteImagesFromSet] user테이블에서 image ${toBeDeletedImage.key}연결 해제 성공`,
            );
          }
        }
      }),
    );
  } catch (err) {
    console.log("이미지 삭제 중 오류 발생, 이미지 복구 시작!");

    const results = await Promise.all(
      problemFileImages.map(async (image) => {
        if (!image) return true;

        const imageKey = image.imageKey;
        const exists = await checkIfImageExistsOnS3ByImageKey(imageKey);

        return !exists;
      }),
    );

    try {
      await Promise.all(
        results.map(async (result, index) => {
          if (!result) {
            const image = problemFileImages[index];
            if (!image) throw new Error("이미지가 null입니다.");

            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: image.imageKey,
              Body: (await image.imageFile.arrayBuffer()) as Uint8Array,
              ContentType: image.imageFile.type,
            });
            const response = await s3.send(command);

            if (!(response.$metadata.httpStatusCode === 200))
              throw new Error("S3에 이미지를 복구하는 중 오류가 발생했습니다.");
          }
        }),
      );
    } catch (err) {
      console.error("이미지 복구 중 오류 발생:", err);
      throw new Error("이미지를 삭제하는 중 오류가 발생했습니다.");
    }
    throw new Error("이미지를 삭제하는 중 오류가 발생했습니다.");
  }
}

export async function deleteProblemSets(
  problemSetUUIDs: string[],
  userEmail: string,
) {
  console.log("[deleteProblemSets] 함수 시작");
  try {
    const result = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      // 문제집 안의 문제들 찾기

      const allProblemsSet = await dt.query.problemSet.findMany({
        where: (problemSet, { inArray, and }) =>
          and(
            inArray(problemSet.uuid, problemSetUUIDs),
            eq(problemSet.userUuid, userUuid),
          ),
        with: {
          problems: {
            with: {
              image: true,
            },
          },
        },
      });

      if (allProblemsSet.length === 0)
        throw new Error("문제집들을 찾는 중 오류가 발생했습니다.");

      const imageKeyCounts = allProblemsSet.reduce(
        (acc, problemSet) => {
          problemSet.problems.forEach((problem) => {
            if (problem.image) {
              const key = problem.image.key;
              if (!acc[key]) {
                acc[key] = 1;
              } else {
                acc[key]++;
              }
            }
          });
          return acc;
        },
        {} as { [key: string]: number },
      );

      const toBeDeletedImage = Object.entries(imageKeyCounts).map(
        ([key, problemSetCount]) => ({
          key,
          problemSetCount,
        }),
      );

      console.log("[deleteProblemSets] toBeDeletedImage: ", toBeDeletedImage);

      // 문제집 안의 문제 이미지들 삭제
      if (toBeDeletedImage.length > 0) {
        await deleteImagesFromSet(toBeDeletedImage, userEmail, dt);
      }

      // 문제집 삭제
      await dt
        .delete(problemSet)
        .where(
          and(
            inArray(problemSet.uuid, problemSetUUIDs),
            eq(problemSet.userUuid, userUuid),
          ),
        );

      console.log(`[deleteProblemSets] 문제집 ${problemSetUUIDs} 삭제 성공`);
      return true;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 삭제하는 중 오류가 발생했습니다.");
  }
}

export async function deleteProblemResults(
  resultUUIDs: string[],
  userEmail: string,
) {
  try {
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      const AllResults = await dt.query.result.findMany({
        where: (result, { inArray, and }) =>
          and(inArray(result.uuid, resultUUIDs), eq(result.userUuid, userUuid)),
        with: {
          problemResults: {
            with: {
              image: true,
            },
          },
        },
      });

      if (AllResults.length === 0)
        throw new Error("시험 결과를 찾는 중 오류가 발생했습니다.");

      console.log("[AllResults] : ", AllResults);

      const imageKeyCounts = AllResults.reduce(
        (acc, result) => {
          result.problemResults.forEach((problemResult) => {
            if (problemResult.image) {
              const key = problemResult.image.key;
              if (!acc[key]) {
                acc[key] = 1;
              } else {
                acc[key]++;
              }
            }
          });
          return acc;
        },
        {} as { [key: string]: number },
      );

      const toBeDeletedImage = Object.entries(imageKeyCounts).map(
        ([key, problemSetCount]) => ({
          key,
          problemSetCount,
        }),
      );
      console.log(
        "[deleteProblemResults] toBeDeletedImage : ",
        toBeDeletedImage,
      );

      if (toBeDeletedImage.length > 0) {
        await deleteImagesFromSet(toBeDeletedImage, userEmail, dt);
      }

      await dt
        .delete(result)
        .where(
          and(inArray(result.uuid, resultUUIDs), eq(result.userUuid, userUuid)),
        );
      console.log(`[deleteProblemResults] 시험 결과 ${resultUUIDs} 삭제 성공`);
      return true;
    });

    return transactionResult;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 삭제하는 중 오류가 발생했습니다.");
  }
}

export async function validateExamProblem(
  problem: ExamProblem,
  answer: string | (number | null)[],
) {
  let finalResult: boolean | null = null;

  if (!problem || !problem.uuid) throw new Error("something is null");

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

export async function getTotalReferencesOfImageByImageUuid(
  imageUuid: string,
  dt: DrizzleTransaction,
) {
  try {
    const result = await dt.query.image.findFirst({
      where: eq(image.uuid, imageUuid),
      with: {
        problems: {
          with: {
            problemSet: {
              columns: {
                uuid: true,
              },
            },
          },
        },
        problemResults: {
          with: {
            result: {
              columns: {
                uuid: true,
              },
            },
          },
        },
      },
    });

    if (!result)
      throw new Error("해당하는 uuid를 가진 이미지가 존재하지 않습니다.");

    const problemSetCount = result.problems.reduce((acc, cur) => {
      if (!acc.includes(cur.problemSet.uuid)) {
        acc.push(cur.problemSet.uuid);
      }
      return acc;
    }, [] as string[]).length;

    const problemResultsCount = result.problemResults.reduce((acc, cur) => {
      if (!acc.includes(cur.result.uuid)) {
        acc.push(cur.result.uuid);
      }
      return acc;
    }, [] as string[]).length;

    return problemSetCount + problemResultsCount;
  } catch (err) {
    console.error(err);
    throw new Error(
      "이미지를 참조하는 문제나 결과의 개수를 확인하는 중 오류가 발생했습니다.",
    );
  }
}

export async function getPublicProblemSets(page: string, pageSize: string) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const [[{ value: totalProblemSetsCount }], problemSets] =
        await Promise.all([
          drizzleSession
            .select({ value: count() })
            .from(problemSet)
            .where(eq(problemSet.isPublic, true)),
          dt.query.problemSet.findMany({
            where: eq(problemSet.isPublic, true),
            offset: (parseInt(page) - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
            with: {
              problems: {
                orderBy: (problem, { asc }) => [asc(problem.order)],
                with: {
                  image: true,
                },
              },
              user: true,
            },
          }),
        ]);

      const returnData: PublicProblemSetWithPagination = {
        data: problemSets.map((problemSet) => ({
          uuid: problemSet.uuid,
          name: problemSet.name,
          description: problemSet.description ?? undefined,
          updatedAt: problemSet.updatedAt,
          examProblemsCount: problemSet.problems.length,
          createdBy: problemSet.user.name,
        })),
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(totalProblemSetsCount / parseInt(pageSize)),
          total: problemSets.length,
        },
      };

      return returnData;
    });
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getPublicProblemSetsByName(
  name: string,
  page: string,
  pageSize: string,
) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const problemSets = await dt.query.problemSet.findMany({
        where: (problemSet, { like, and, eq }) =>
          and(
            like(problemSet.name, `%${name}%`),
            eq(problemSet.isPublic, true),
          ),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize),
        orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
        with: {
          problems: {
            orderBy: (problem, { asc }) => [asc(problem.order)],
            with: {
              image: true,
            },
          },
          user: true,
        },
      });

      const returnData: PublicProblemSetWithPagination = {
        data: problemSets.map((problemSet) => ({
          uuid: problemSet.uuid,
          name: problemSet.name,
          updatedAt: problemSet.updatedAt,
          description: problemSet.description ?? undefined,
          examProblemsCount: problemSet.problems.length,
          createdBy: problemSet.user.name,
        })),
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(problemSets.length / parseInt(pageSize)),
          total: problemSets.length,
        },
      };

      return returnData;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getReferecesOfImageByImageKey(
  imageKey: string,
  dt: DrizzleTransaction,
) {
  try {
    const imageUuid = await getImageUuidOnDBByImageKey(imageKey, dt);
    if (!imageUuid)
      throw new Error("이미지 uuid를 찾는 중 오류가 발생했습니다.");

    const imageUsers = await dt
      .select({ userUuid: imageToUser.userUuid })
      .from(imageToUser)
      .where(eq(imageToUser.imageUuid, imageUuid));

    const users = await Promise.all(
      imageUsers.map(async (imageUser) => {
        const userEmail = await dt.query.user.findFirst({
          where: (user_, { eq }) => eq(user_.uuid, imageUser.userUuid),
          columns: {
            email: true,
          },
        });
        if (!userEmail) throw new Error("userEmail is null");

        const problems = await dt.query.problem.findMany({
          where: (problem, { eq, and }) =>
            and(
              eq(problem.imageUuid, imageUuid),
              eq(problem.userUuid, imageUser.userUuid),
            ),
          with: {
            problemSet: {
              columns: {
                uuid: true,
              },
            },
          },
        });

        const problemResults = await dt.query.problemResult.findMany({
          where: (problemResult, { eq, and }) =>
            and(
              eq(problemResult.imageUuid, imageUuid),
              eq(problemResult.userUuId, imageUser.userUuid),
            ),
          with: {
            result: {
              columns: {
                uuid: true,
              },
            },
          },
        });

        return {
          uuid: imageUser.userUuid,
          email: userEmail.email,
          problems,
          problemResults,
        };
      }),
    );

    console.log("[getReferecesOfImageByImageKey] users : ", users);

    if (users.length === 0)
      throw new Error("해당하는 key를 가진 이미지가 존재하지 않습니다.");

    const result = {
      users: users.map((user) => {
        const problemSetCount = user.problems.reduce((acc, cur) => {
          if (!acc.includes(cur.problemSet.uuid)) {
            acc.push(cur.problemSet.uuid);
          }
          return acc;
        }, [] as string[]).length;

        const problemResultsCount = user.problemResults.reduce((acc, cur) => {
          if (!acc.includes(cur.result.uuid)) {
            acc.push(cur.result.uuid);
          }
          return acc;
        }, [] as string[]).length;

        const count = {
          total: problemSetCount + problemResultsCount,
          problemSetCount,
          problemResultsCount,
        };
        console.log("count : ", count);

        return {
          userEmail: user.email,
          userUuid: user.uuid,
          count,
        };
      }),
    };
    const allUserCount = {
      ...result.users.reduce(
        (acc, cur) => {
          acc.problemSetCount += cur.count.problemSetCount;
          acc.problemResultsCount += cur.count.problemResultsCount;
          return acc;
        },
        { problemSetCount: 0, problemResultsCount: 0 },
      ),
      total: result.users.reduce((acc, cur) => {
        acc += cur.count.problemSetCount;
        acc += cur.count.problemResultsCount;
        return acc;
      }, 0),
    };
    return {
      ...result,
      allUserCount,
    };
  } catch (err) {
    console.error(err);
    throw new Error(
      "이미지를 참조하는 문제나 결과의 개수를 확인하는 중 오류가 발생했습니다.",
    );
  }
}

export function validateS3Key(fileName: string): boolean {
  // SHA-256 해시-파일이름.확장자 패턴 정의
  const pattern = /^[a-fA-F0-9]{64}-[^.]+\.[a-zA-Z0-9]+$/;
  return pattern.test(fileName);
}

export async function evaluateProblems(
  examProblems: ExamProblem[],
  problemSetName: string,
  userEmail: string,
) {
  try {
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const validateResult = problemsSchema.safeParse(examProblems);

      if (!validateResult.success) {
        throw new Error("인수로 전달된 문제들이 유효하지 않습니다.");
      }

      const [{ uuid: resultsUuid }] = await dt
        .insert(result)
        .values({
          problemSetName,
          userUuid,
          updatedAt: new Date(),
        })
        .returning({ uuid: result.uuid });

      await Promise.all(
        examProblems.map(async (problem, index) => {
          if (!problem || !problem.uuid) throw new Error("something is null");

          if (!isProblemAsnwered(problem))
            throw new Error("모든 정답을 입력해주세요.");

          if (problem.type === "obj" && problem.isAnswerMultiple === false) {
            if (isAnsweredMoreThanOne(problem)) {
              throw new Error(
                "단일 선택 문제입니다. 하나의 정답만 선택해주세요.",
              );
            }
          }

          if (
            problem.type === "sub" &&
            (problem.subAnswer === "" || problem.subAnswer === null)
          ) {
            throw new Error("주관식 문제입니다. 정답을 입력해주세요.");
          }

          const answer = await getAnswerByProblemUuid(problem.uuid, dt);

          if (!answer) {
            throw new Error("result is null");
          }

          const evaluationResult = await validateExamProblem(problem, answer);

          await postProblemResult(
            index + 1,
            problem,
            resultsUuid,
            evaluationResult,
            answer,
            userUuid,
            dt,
          );
        }),
      );

      return resultsUuid;
    });

    return transactionResult;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}
