import "server-only";

import {
  ExamProblem,
  ProblemSetWithPagination,
  Candidate,
  DrizzleTransaction,
  ResultsWithPagination,
  ProblemReplacedImageKey,
  PublicProblemSetWithPagination,
  ExamProblemSet,
  ProblemSetComment,
  CorrectAnswer,
  examProblemsSchema,
  uuidSchema,
  ExamResultsSet,
  ProblemSetWithName,
  ExamResultCandidate,
} from "@/types/problems";
import { getUserUUIDbyEmail } from "./user";
import {
  analyzeProblemsImagesAndDoCallback,
  generateFileHash,
  isString,
  isValidUUID,
} from "@/utils/problems";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  eq,
  like,
  and,
  or,
  inArray,
  count,
  desc,
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
  problemSetComment,
} from "@/db/schema";

import { s3Client } from "@/utils/AWSs3Client";
import drizzleSession from "@/db/drizzle";
import { problemShuffle } from "@/utils/problemShuffle";
import { evaluateSubjectiveProblem } from "./evaluateSubjectiveQuestion";

export async function postProblems({
  problemSetName,
  toBePostedProblems,
  userEmail,
  timeLimit,
  isPublic,
  description,
}: {
  problemSetName: string;
  userEmail: string;
  timeLimit?: number;
  toBePostedProblems: ProblemReplacedImageKey[];
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
          updatedAt: new Date(),
          description,
          timeLimit,
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
  timeLimit,
  description,
  problemSetIsPublic,
  userEmail,
}: {
  problemSetName: string;
  replacingProblems: ProblemReplacedImageKey[];
  problemSetUUID: string;
  timeLimit?: number;
  description?: string;
  problemSetIsPublic: boolean;
  userEmail: string;
}) {
  console.log("문제 업데이트 시작!");

  try {
    console.log("문제 업데이트 트랜잭션 시작");
    const result = await drizzleSession.transaction(async (dt) => {
      console.log("기존 문제 불러오기 시작");

      const [oldProblems, userUuid] = await Promise.all([
        dt.query.problem.findMany({
          where: eq(problem.problemSetUuid, problemSetUUID),
          with: {
            image: true,
          },
          columns: {
            uuid: true,
            order: true,
          },
        }),
        getUserUUIDbyEmail(userEmail, dt),
      ]);

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
        }) => {
          if (!isNoImage && isFirstImage && imageKey) {
            const uuid = await createImageOnDBIfNotExistByS3Key(
              imageKey,
              userEmail,
              dt,
            );

            if (duplicateIndexes && duplicateIndexes.length > 0) {
              return duplicateIndexes.map((i) => ({
                index: i,
                uuid,
              }));
            }
            return {
              index,
              uuid,
            };
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

      const toBeDeletedImageKey = oldProblems
        .map((oldProblem) => oldProblem.image?.key)
        .filter(
          (key): key is string =>
            !!key &&
            !newProblems.some((newProblem) => newProblem.image?.key === key),
        )
        .map((key) => ({ key, problemSetCount: 1 }));

      console.log("toBeDeletedImageKey : ", toBeDeletedImageKey);

      if (toBeDeletedImageKey.length > 0) {
        await deleteImagesFromSet(toBeDeletedImageKey, userEmail, dt);
      }

      await Promise.all([
        dt
          .update(problemSet)
          .set({
            name: problemSetName,
            isPublic: problemSetIsPublic,
            description: description,
            timeLimit: timeLimit,
            updatedAt: new Date(),
          })
          .where(eq(problemSet.uuid, problemSetUUID)),
        ...oldProblems.map((oldProblem) =>
          dt.delete(problem).where(eq(problem.uuid, oldProblem.uuid)),
        ),
      ]);

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
  page: number,
  pageSize: number,
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
            offset: (page - 1) * pageSize,
            limit: pageSize,
            orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
            with: {
              problems: {
                orderBy: (problem, { asc }) => [asc(problem.order)],
                with: {
                  image: true,
                },
              },
              user: {
                columns: {
                  name: true,
                },
              },
            },
          }),
        ]);

      const returnData: ProblemSetWithPagination = {
        data: problemSets.map((problemSet) => ({
          createdBy: problemSet.user.name,
          uuid: problemSet.uuid,
          timeLimit: problemSet.timeLimit,
          name: problemSet.name,
          createdAt: problemSet.createdAt,
          updatedAt: problemSet.updatedAt,
          examProblemsCount: problemSet.problems.length,
        })),
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: Math.ceil(totalProblemSetsCount / pageSize),
          total: totalProblemSetsCount,
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
  page: number,
  pageSize: number,
) {
  try {
    const searchName = name.trim().split(" ");
    const data = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const [problemSets, [{ totalCount }]] = await Promise.all([
        dt.query.problemSet.findMany({
          where: (problemSet, { like, and, or, eq }) =>
            and(
              or(
                ...searchName.map((name) => like(problemSet.name, `%${name}%`)),
                ...searchName.map((name) =>
                  like(problemSet.description, `%${name}%`),
                ),
              ),
              eq(problemSet.userUuid, userUuid),
            ),
          offset: (page - 1) * pageSize,
          limit: pageSize,
          orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
          with: {
            problems: {
              orderBy: (problem, { asc }) => [asc(problem.order)],
              with: {
                image: true,
              },
            },
            user: {
              columns: {
                name: true,
              },
            },
          },
        }),
        dt
          .select({ totalCount: count() })
          .from(problemSet)
          .where(
            and(
              eq(problemSet.userUuid, userUuid),
              or(
                ...searchName.map((name) => like(problemSet.name, `%${name}%`)),
                ...searchName.map((name) =>
                  like(problemSet.description, `%${name}%`),
                ),
              ),
            ),
          ),
      ]);

      const returnData: ProblemSetWithPagination = {
        data: problemSets.map((problemSet) => ({
          createdBy: problemSet.user.name,
          timeLimit: problemSet.timeLimit,
          uuid: problemSet.uuid,
          name: problemSet.name,
          createdAt: problemSet.createdAt,
          updatedAt: problemSet.updatedAt,
          examProblemsCount: problemSet.problems.length,
        })),
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: Math.ceil(totalCount / pageSize),
          total: totalCount,
        },
      };

      return returnData;
    });

    return data;
  } catch (err) {
    console.error(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getRandomExamProblemsByProblemSetUUID(
  UUID: string,
  userEmail: string,
) {
  if (!isValidUUID(UUID)) {
    return null;
  }
  const data = await getProblemsSetByUUID(UUID, userEmail);

  if (!data) {
    throw null;
  }

  const examProblems: ExamProblem[] = data.problems.map((problem) => {
    if (!problem) throw new Error("문제가 없습니다.");

    return {
      order: problem.order,
      uuid: problem.uuid || "",
      type: problem.type as "obj" | "sub",
      question: problem.question,
      additionalView: problem.additionalView,
      image: problem.image ?? null,
      isAnswerMultiple: problem.isAnswerMultiple,
      // 문제의 정답을 알 수 없게 함
      candidates:
        problem.candidates?.map((candidate) => ({
          id: candidate.id,
          text: candidate.text,
          isAnswer: false,
        })) ?? null,

      // 문제의 정답을 알 수 없게 함
      subAnswer: problem.type === "sub" ? "" : null,
    };
  });

  const result: ExamProblemSet = {
    creator: data.userName,
    description: data.description ?? "",
    updatedAt: new Date(),
    uuid: data.uuid,
    name: data.name,
    timeLimit: data.timeLimit ?? null,
    problems: problemShuffle(examProblems),
  };

  return result;
}

export async function getExamProblemsByProblemSetUUID(
  UUID: string,
  userEmail: string,
) {
  if (!isValidUUID(UUID)) {
    return null;
  }
  const data = await getProblemsSetByUUID(UUID, userEmail);

  if (!data) {
    throw null;
  }

  const examProblems: ExamProblem[] = data.problems.map((problem) => {
    if (!problem) throw new Error("문제가 없습니다.");

    return {
      order: problem.order,
      uuid: problem.uuid || "",
      type: problem.type as "obj" | "sub",
      question: problem.question,
      additionalView: problem.additionalView,
      image: problem.image ?? null,
      isAnswerMultiple: problem.isAnswerMultiple,
      // 문제의 정답을 알 수 없게 함
      candidates:
        problem.candidates?.map((candidate) => ({
          id: candidate.id,
          text: candidate.text,
          isAnswer: false,
        })) ?? null,

      // 문제의 정답을 알 수 없게 함
      subAnswer: problem.type === "sub" ? "" : null,
    };
  });

  const result: ExamProblemSet = {
    creator: data.userName,
    description: data.description ?? "",
    updatedAt: new Date(),
    uuid: data.uuid,
    name: data.name,
    timeLimit: data.timeLimit ?? null,
    problems: examProblems,
  };

  return result;
}

export async function getProblemsSetByUUID(uuid: string, userEmail: string) {
  if (!isValidUUID(uuid)) {
    return null;
  }

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
          user: {
            columns: {
              name: true,
            },
          },
        },
      });

      if (!foundProblemSet) return null;

      const returnData: ProblemSetWithName = {
        uuid: foundProblemSet.uuid,
        name: foundProblemSet.name,
        userName: foundProblemSet.user.name,
        createdAt: foundProblemSet.createdAt,
        updatedAt: foundProblemSet.updatedAt,
        timeLimit: foundProblemSet.timeLimit,
        isPublic: foundProblemSet.isPublic,
        description: foundProblemSet.description ?? "",
        problems: foundProblemSet.problems.map((problem) => ({
          order: problem.order,
          uuid: problem.uuid,
          question: problem.question,
          additionalView: problem.additionalView ?? "",
          candidates: problem.candidates,
          image: problem.image,
          isAdditionalViewButtonClicked: problem.additionalView ? true : false,
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

export async function checkUserPermissionForResults(
  resultsUUID: string,
  userEmail: string,
) {
  try {
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const queryResult = await dt.query.result.findFirst({
        where: and(eq(result.uuid, resultsUUID), eq(result.userUuid, userUuid)),
      });

      return queryResult ? "OK" : "NO";
    });

    return transactionResult;
  } catch (err) {
    console.log(err);
    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
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

export async function getExamResultsByUUID(
  resultUuid: string,
  userEmail?: string,
) {
  try {
    const result = await drizzleSession.transaction(async (dt) => {
      let userUuid: string | null = null;
      if (userEmail) {
        userUuid = await getUserUUIDbyEmail(userEmail, dt);
      }

      const result = await dt.query.result.findFirst({
        where: (result, { eq, and }) =>
          userUuid
            ? and(eq(result.uuid, resultUuid), eq(result.userUuid, userUuid))
            : eq(result.uuid, resultUuid),
        with: {
          problemResults: {
            orderBy: (problemResult, { asc }) => [asc(problemResult.order)],
            with: {
              image: true,
            },
          },
        },
      });

      if (!result) return null;

      const returnData: ExamResultsSet = {
        ...result,
        problemSetName: result.problemSetName,
        problemResults: result.problemResults.map((problemResult) => ({
          uuid: problemResult.uuid,
          order: problemResult.order,
          isCorrect: problemResult.isCorrect,
          candidates: problemResult.candidates,
          subjectiveAnswered: problemResult.subjectiveAnswered,
          question: problemResult.question,
          additionalView: problemResult.additionalView,
          questionType: problemResult.questionType as "obj" | "sub",
          isAnswerMultiple: problemResult.isAnswerMultiple,
          correctCandidates: problemResult.correctCandidates,
          correctSubjectiveAnswer: problemResult.correctSubjectiveAnswer,
          image: problemResult.image,
          createdAt: problemResult.createdAt,
          updatedAt: problemResult.updatedAt,
        })),
      };

      return returnData;
    });

    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getExamResults(
  userEmail: string,
  page: number,
  pageSize: number,
) {
  try {
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);

      const [[{ value: totalExamResultsCount }], examResults] =
        await Promise.all([
          dt
            .select({ value: count() })
            .from(result)
            .where(eq(result.userUuid, userUuid)),
          dt.query.result.findMany({
            where: eq(result.userUuid, userUuid),
            offset: (page - 1) * pageSize,
            limit: pageSize,
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
          page,
          pageSize: pageSize,
          pageCount: Math.ceil(totalExamResultsCount / pageSize),
          total: totalExamResultsCount,
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

export async function getExamResultsByName(
  userEmail: string,
  name: string,
  page: number,
  pageSize: number,
) {
  try {
    const searchName = name.trim().split(" ");
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const userUuid = await getUserUUIDbyEmail(userEmail, dt);
      const [[{ totalExamResultsCount }], examResults] = await Promise.all([
        dt
          .select({ totalExamResultsCount: count() })
          .from(result)
          .where(
            and(
              or(
                ...searchName.map((name) => like(problemSet.name, `%${name}%`)),
              ),
              eq(result.userUuid, userUuid),
            ),
          ),
        dt.query.result.findMany({
          where: (result, { and, like }) =>
            and(
              or(
                ...searchName.map((name) => like(problemSet.name, `%${name}%`)),
              ),
              eq(result.userUuid, userUuid),
            ),
          offset: (page - 1) * pageSize,
          limit: pageSize,
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
          page: page,
          pageSize: pageSize,
          pageCount: Math.ceil(totalExamResultsCount / pageSize),
          total: totalExamResultsCount,
        },
      };

      return finalResult;
    });

    return transactionResult;
  } catch (err) {
    console.error(err);
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
            throw new Error(
              `이미지 ${toBeDeletedImage.key}의 UUID를 찾는 데 실패했습니다.`,
            );

          console.log(
            `\n[${toBeDeletedImage.key}]\nif(totalRefercence.totalCount.total) === toBeDeletedImage.problemSetCount\nif(${totalReference.totalCount.total} === ${toBeDeletedImage.problemSetCount})`,
          );

          if (
            totalReference.totalCount.total === toBeDeletedImage.problemSetCount
          ) {
            console.log(
              `[deleteImagesFromSet] 참조가 없어 이미지 ${toBeDeletedImage.key} 삭제 시작`,
            );

            // S3에서 이미지 삭제
            const command = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: toBeDeletedImage.key,
            });

            const response = await s3.send(command);
            if (response.$metadata.httpStatusCode !== 204)
              throw new Error(
                `S3에서 이미지 ${toBeDeletedImage.key}를 삭제하는 데 실패했습니다.`,
              );
            console.log(
              `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key} s3에서 삭제 성공`,
            );

            // 데이터베이스에서 이미지 정보 삭제
            await dt.delete(image).where(eq(image.uuid, imageUuid));

            console.log(
              `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key} image 테이블에서 삭제 성공`,
            );

            console.log(
              `[deleteImagesFromSet] 이미지 ${toBeDeletedImage.key} 삭제 성공`,
            );
          }

          // 현재 사용자의 이미지 참조 정보 삭제
          await dt
            .delete(imageToUser)
            .where(
              and(
                eq(imageToUser.imageUuid, imageUuid),
                eq(imageToUser.userUuid, userUuid),
              ),
            );

          console.log(
            `[deleteImagesFromSet] 현재 사용자의 이미지 ${toBeDeletedImage.key} 참조 정보 삭제 성공`,
          );
        }
      }),
    );
  } catch (err) {
    console.error("이미지 삭제 중 오류 발생:", err);

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
            if (!image) throw new Error(`복구할 이미지 ${index}가 없습니다.`);

            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: image.imageKey,
              Body: (await image.imageFile.arrayBuffer()) as unknown as Uint8Array,
              ContentType: image.imageFile.type,
            });
            const response = await s3.send(command);

            if (response.$metadata.httpStatusCode !== 200)
              throw new Error(
                `S3에 이미지 ${image.imageKey}를 복구하는 데 실패했습니다.`,
              );
          }
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error("이미지 복구 중 오류 발생:", err);
        throw new Error(`이미지 복구 중 오류가 발생했습니다: ${err.message}`);
      }
    }
    if (err instanceof Error) {
      throw new Error(`이미지 삭제 중 오류가 발생했습니다: ${err.message}`);
    }
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

export async function validateExamProblemAnswer(
  examProblem: ExamProblem,
  answer: CorrectAnswer,
) {
  let finalResult = false;

  if (!examProblem || !examProblem.uuid) {
    throw new Error("something is null");
  }

  if (examProblem.type === "obj") {
    if (!Array.isArray(answer)) {
      throw new Error("Answer is not an array");
    }

    const userAnswer = examProblem.candidates
      ?.filter((candidate) => candidate.isAnswer)
      .map((candidate) => candidate.id);

    if (userAnswer && userAnswer.length > 0) {
      finalResult = answer.every((id) => userAnswer.includes(id));
    }
  } else if (examProblem.type === "sub") {
    if (typeof answer !== "string") {
      throw new Error("Answer is not a string");
    }

    if (examProblem.subAnswer) {
      finalResult = examProblem.subAnswer.trim() === answer.trim();
    } else {
      finalResult = !examProblem.subAnswer && !answer;
    }
  } else {
    throw new Error("Invalid problem type");
  }

  return finalResult;
}

export async function validatePublicExamProblemAnswer(
  examProblem: ExamProblem,
  answer: CorrectAnswer,
) {
  let finalResult: boolean | null = null;

  if (!examProblem || !examProblem.uuid) {
    throw new Error("something is null");
  }

  if (examProblem.type === "obj") {
    if (!Array.isArray(answer)) {
      throw new Error("Answer is not an array");
    }

    const userAnswer = examProblem.candidates
      ?.filter((candidate) => candidate.isAnswer)
      .map((candidate) => candidate.id);

    finalResult =
      (userAnswer && answer.every((id) => userAnswer.includes(id))) ?? null;
  } else if (examProblem.type === "sub") {
    if (typeof answer !== "string") {
      throw new Error("Answer is not a string");
    }

    finalResult = examProblem.subAnswer === answer;
  } else {
    throw new Error("Invalid problem type");
  }

  if (finalResult === null) {
    throw new Error("finalResult is null");
  }

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

export async function getPublicProblemSets(
  page: number,
  pageSize: number,
  orderBy: "popular" | "newest",
) {
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
            offset: (page - 1) * pageSize,
            limit: pageSize,
            orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
            with: {
              problems: {
                orderBy: (problem, { asc }) => [asc(problem.order)],
                with: {
                  image: true,
                },
              },
              user: true,
              likedProblemSets: {
                columns: { problemSetUuid: true },
              },
            },
          }),
        ]);

      const returnData: PublicProblemSetWithPagination = {
        data:
          orderBy === "popular"
            ? problemSets
                .map((problemSet) => ({
                  uuid: problemSet.uuid,
                  name: problemSet.name,
                  timeLimit: problemSet.timeLimit,
                  description: problemSet.description ?? undefined,
                  updatedAt: problemSet.updatedAt,
                  examProblemsCount: problemSet.problems.length,
                  createdBy: problemSet.user.name,
                  likes: problemSet.likedProblemSets.length,
                }))
                .toSorted((a, b) => b.likes - a.likes)
            : problemSets.map((problemSet) => ({
                uuid: problemSet.uuid,
                name: problemSet.name,
                timeLimit: problemSet.timeLimit,
                description: problemSet.description ?? undefined,
                updatedAt: problemSet.updatedAt,
                examProblemsCount: problemSet.problems.length,
                createdBy: problemSet.user.name,
                likes: problemSet.likedProblemSets.length,
              })),
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: Math.ceil(totalProblemSetsCount / pageSize),
          total: totalProblemSetsCount,
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
  page: number,
  pageSize: number,
  orderBy: "popular" | "newest",
) {
  try {
    const searchName = name.trim().split(" ");
    const data = await drizzleSession.transaction(async (dt) => {
      const [problemSets, [{ totalCount }]] = await Promise.all([
        dt.query.problemSet.findMany({
          where: (problemSet, { like, and, or, eq }) =>
            and(
              or(
                ...searchName.map((name) => like(problemSet.name, `%${name}%`)),
                ...searchName.map((name) =>
                  like(problemSet.description, `%${name}%`),
                ),
              ),
              eq(problemSet.isPublic, true),
            ),
          offset: (page - 1) * pageSize,
          limit: pageSize,
          orderBy: (problemSet, { desc }) => [desc(problemSet.updatedAt)],
          with: {
            problems: {
              orderBy: (problem, { asc }) => [asc(problem.order)],
              with: { image: true },
            },
            user: true,
            likedProblemSets: {
              columns: { problemSetUuid: true },
            },
          },
        }),
        dt
          .select({ totalCount: count() })
          .from(problemSet)
          .where(
            and(
              or(
                ...searchName.map((name) => like(problemSet.name, `%${name}%`)),
                ...searchName.map((name) =>
                  like(problemSet.description, `%${name}%`),
                ),
              ),
              eq(problemSet.isPublic, true),
            ),
          ),
      ]);

      console.log();

      const returnData: PublicProblemSetWithPagination = {
        data:
          orderBy === "popular"
            ? problemSets
                .map((problemSet) => ({
                  uuid: problemSet.uuid,
                  name: problemSet.name,
                  timeLimit: problemSet.timeLimit,
                  description: problemSet.description ?? undefined,
                  updatedAt: problemSet.updatedAt,
                  examProblemsCount: problemSet.problems.length,
                  createdBy: problemSet.user.name,
                  likes: problemSet.likedProblemSets.length,
                }))
                .toSorted((a, b) => b.likes - a.likes)
            : problemSets.map((problemSet) => ({
                uuid: problemSet.uuid,
                name: problemSet.name,
                timeLimit: problemSet.timeLimit,
                description: problemSet.description ?? undefined,
                updatedAt: problemSet.updatedAt,
                examProblemsCount: problemSet.problems.length,
                createdBy: problemSet.user.name,
                likes: problemSet.likedProblemSets.length,
              })),
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: Math.ceil(totalCount / pageSize),
          total: totalCount,
        },
      };

      console.log(returnData);
      return returnData;
    });

    return data;
  } catch (err) {
    console.error(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function checkIfPublicProblemSetExists(problemSetUUID: string) {
  const isUUIDValidated = isValidUUID(problemSetUUID);

  if (!isUUIDValidated) {
    return false;
  }

  try {
    const result = await drizzleSession.query.problemSet.findFirst({
      where: and(
        eq(problemSet.uuid, problemSetUUID),
        eq(problemSet.isPublic, true),
      ),
    });

    return result ? true : false;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function checkIfPublicExamResultExists(examResultUUID: string) {
  const isUUIDValidated = isValidUUID(examResultUUID);

  if (!isUUIDValidated) {
    return false;
  }

  try {
    const queryResult = await drizzleSession.query.result.findFirst({
      where: (result, { eq }) => eq(result.uuid, examResultUUID),
    });

    return queryResult ? true : false;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getPublicProblemSetByUUID(problemSetUUID: string) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const foundProblemSet = await dt.query.problemSet.findFirst({
        where: and(
          eq(problemSet.uuid, problemSetUUID),
          eq(problemSet.isPublic, true),
        ),
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

      if (!foundProblemSet) return null;

      //정답은 지움
      const returnData: ExamProblemSet = {
        uuid: foundProblemSet.uuid,
        name: foundProblemSet.name,
        updatedAt: foundProblemSet.updatedAt,
        description: foundProblemSet.description ?? "",
        timeLimit: foundProblemSet.timeLimit,
        creator: foundProblemSet.user.name,
        problems: foundProblemSet.problems.map((problem) => ({
          order: problem.order,
          uuid: problem.uuid,
          question: problem.question,
          type: problem.questionType as "obj" | "sub",
          candidates:
            problem.candidates?.map((candidate) => ({
              id: candidate.id,
              text: candidate.text,
              isAnswer: false,
            })) ?? null,
          subAnswer: "",
          image: problem.image ?? null,
          additionalView: problem.additionalView ?? "",
          isAnswerMultiple: problem.isAnswerMultiple ?? false,
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

export async function getRandomExamPublicProblemSetByUUID(
  problemSetUUID: string,
) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const foundProblemSet = await dt.query.problemSet.findFirst({
        where: and(
          eq(problemSet.uuid, problemSetUUID),
          eq(problemSet.isPublic, true),
        ),
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

      if (!foundProblemSet) return null;

      const originalProblems = foundProblemSet.problems.map((problem) => ({
        order: problem.order,
        uuid: problem.uuid,
        question: problem.question,
        type: problem.questionType as "obj" | "sub",
        isAnswerMultiple: problem.isAnswerMultiple ?? false,
        additionalView: problem.additionalView ?? "",
        image: problem.image ?? null,
        subAnswer: problem.questionType === "sub" ? "" : null,
        candidates:
          problem.candidates?.map((candidate) => ({
            id: candidate.id,
            text: candidate.text,
            isAnswer: candidate.isAnswer,
          })) ?? null,
      }));

      const returnData: ExamProblemSet = {
        uuid: foundProblemSet.uuid,
        name: foundProblemSet.name,
        updatedAt: foundProblemSet.updatedAt,
        description: foundProblemSet.description ?? "",
        timeLimit: foundProblemSet.timeLimit,
        creator: foundProblemSet.user.name,
        problems: problemShuffle(originalProblems),
      };

      return returnData;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getPublicProblemSetComments(problemSetUUID: string) {
  const isUUIDValidated = uuidSchema.safeParse(problemSetUUID);
  if (!isUUIDValidated.success) {
    return null;
  }

  try {
    const data: ProblemSetComment[] = await drizzleSession.transaction(
      async (dt) => {
        const comments = await dt
          .select({ problemSetComment })
          .from(problemSetComment)
          .innerJoin(
            problemSet,
            and(
              eq(problemSet.uuid, problemSetUUID),
              eq(problemSet.isPublic, true),
            ),
          )
          .where(eq(problemSetComment.problemSetUuid, problemSetUUID))
          .orderBy(desc(problemSetComment.createdAt));

        const user = await Promise.all(
          comments.map(async (comment) => {
            const user =
              (await dt.query.user.findFirst({
                where: (user, { eq }) =>
                  eq(user.uuid, comment.problemSetComment.userUuid),
                columns: {
                  name: true,
                  uuid: true,
                },
              })) ?? null;

            return user ?? null;
          }),
        );
        const result = comments.map((comment, i) => ({
          uuid: comment.problemSetComment.uuid,
          content: comment.problemSetComment.content,
          createdAt: comment.problemSetComment.createdAt,
          userName: user?.[i]?.name ?? "탈퇴한 유저",
          userUUID: user?.[i]?.uuid ?? "",
        }));

        return result;
      },
    );

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 댓글을 불러오는 중 오류가 발생했습니다.");
  }
}
export async function getPublicProblemLikes(
  problemSetUUID: string,
  userEmail?: string | null,
) {
  const isUUIDValidated = uuidSchema.safeParse(problemSetUUID);
  if (!isUUIDValidated.success) {
    return null;
  }

  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const [[likes], [liked]] = await Promise.all([
        dt
          .select({ count: count() })
          .from(likedProblemSets)
          .innerJoin(
            problemSet,
            eq(likedProblemSets.problemSetUuid, problemSet.uuid),
          )
          .where(
            and(
              eq(likedProblemSets.problemSetUuid, problemSetUUID),
              eq(problemSet.isPublic, true),
            ),
          ),
        dt
          .select({ count: count() })
          .from(likedProblemSets)
          .innerJoin(user, eq(likedProblemSets.userUuid, user.uuid))
          .where(
            and(
              eq(likedProblemSets.problemSetUuid, problemSetUUID),
              eq(user.email, userEmail ?? ""),
            ),
          ),
      ]);

      console.log(liked);

      return { likes: likes.count, liked: liked.count === 1 };
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 좋아요를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function insertCommentToProblemSetComment({
  problemSetUUID,
  userUUID,
  comment,
}: {
  problemSetUUID: string;
  userUUID: string;
  comment: string;
}) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const date = new Date();
      const [{ uuid }] = await dt
        .insert(problemSetComment)
        .values({
          content: comment,
          problemSetUuid: problemSetUUID,
          userUuid: userUUID,
          createdAt: date,
          updatedAt: date,
        })
        .returning({ uuid: problemSetComment.uuid });

      return uuid;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 댓글을 추가하는 중 오류가 발생했습니다.");
  }
}

export async function deleteCommentFromProblemSetComment({
  commentUUID,
  userUUID,
}: {
  commentUUID: string;
  userUUID: string;
}) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const [{ uuid }] = await dt
        .delete(problemSetComment)
        .where(
          and(
            eq(problemSetComment.uuid, commentUUID),
            eq(problemSetComment.userUuid, userUUID),
          ),
        )
        .returning({ uuid: problemSetComment.uuid });

      return uuid;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 댓글을 삭제하는 중 오류가 발생했습니다.");
  }
}

export async function handlePublicProblemLikes({
  problemSetUUID,
  userUUID,
  liked,
}: {
  problemSetUUID: string;
  userUUID: string;
  liked: boolean;
}) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const date = new Date();

      if (liked) {
        const [{ createdAt }] = await dt
          .delete(likedProblemSets)
          .where(
            and(
              eq(likedProblemSets.problemSetUuid, problemSetUUID),
              eq(likedProblemSets.userUuid, userUUID),
            ),
          )
          .returning({ createdAt: likedProblemSets.createdAt });

        return createdAt;
      } else {
        const [{ createdAt }] = await dt
          .insert(likedProblemSets)
          .values({
            problemSetUuid: problemSetUUID,
            userUuid: userUUID,
            createdAt: date,
          })
          .returning({ createdAt: likedProblemSets.createdAt });

        return createdAt;
      }
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 좋아요를 추가하는 중 오류가 발생했습니다.");
  }
}

async function getCountByImageUuid(
  imageUuid: string,
  userUuid: string,
  dt: DrizzleTransaction,
) {
  const problems = await dt.query.problem.findMany({
    where: and(
      eq(problem.imageUuid, imageUuid),
      eq(problem.userUuid, userUuid),
    ),
    with: { problemSet: { columns: { uuid: true } } },
  });

  const problemResults = await dt.query.problemResult.findMany({
    where: eq(problemResult.imageUuid, imageUuid),
    with: {
      result: {
        columns: { uuid: true, userUuid: true },
      },
    },
  });

  const filteredProblemResults = problemResults.filter(
    (problemResult) => problemResult.result?.userUuid === userUuid,
  );

  const problemSetCount = new Set(
    problems.map((problem) => problem.problemSet.uuid),
  ).size;
  const problemResultsCount = filteredProblemResults.length;

  const count = {
    problemSetCount,
    problemResultsCount,
    total: problemSetCount + problemResultsCount,
  };

  console.log("userUUID : ", userUuid, "count :", count);

  return count;
}

export async function getReferecesOfImageByImageKey(
  imageKey: string,
  drizzleTransaction: DrizzleTransaction,
) {
  try {
    const imageUuid = await getImageUuidOnDBByImageKey(
      imageKey,
      drizzleTransaction,
    );
    if (!imageUuid) {
      throw new Error(
        `이미지 키 '${imageKey}'에 해당하는 uuid를 찾지 못했습니다.`,
      );
    }

    const userUuids = new Set<string>();

    // Problem 테이블에서 이미지를 사용하는 레코드의 userUuid 수집
    const problemUsers = await drizzleTransaction.query.problem.findMany({
      columns: { userUuid: true },
      where: eq(problem.imageUuid, imageUuid),
    });
    problemUsers.forEach((problemUser) => userUuids.add(problemUser.userUuid));

    // ProblemResult 테이블에서 이미지를 사용하는 레코드의 userUuid 수집
    const problemResultUsers =
      await drizzleTransaction.query.problemResult.findMany({
        with: { result: { columns: { userUuid: true } } },
        where: eq(problemResult.imageUuid, imageUuid),
      });
    problemResultUsers.forEach((problemResultUser) => {
      if (problemResultUser.result?.userUuid) {
        userUuids.add(problemResultUser.result.userUuid);
      }
    });

    const users = await Promise.all(
      Array.from(userUuids).map(async (userUuid) => {
        const userEmail = await drizzleTransaction.query.user.findFirst({
          where: eq(user.uuid, userUuid),
          columns: { email: true },
        });

        if (!userEmail) {
          console.warn(`User email not found for user UUID: ${userUuid}`);
          return null;
        }

        const count = await getCountByImageUuid(
          imageUuid,
          userUuid,
          drizzleTransaction,
        );

        return {
          uuid: userUuid,
          userEmail: userEmail.email,
          count,
        };
      }),
    );

    const filteredUsers = users.filter(
      (user): user is NonNullable<typeof user> => user !== null,
    );

    const totalCount = filteredUsers.reduce(
      (acc, cur) => {
        acc.problemSetCount += cur.count.problemSetCount;
        acc.problemResultsCount += cur.count.problemResultsCount;
        acc.total += cur.count.total;
        return acc;
      },
      { problemSetCount: 0, problemResultsCount: 0, total: 0 },
    );

    return {
      users: filteredUsers,
      totalCount,
    };
  } catch (err) {
    console.error(
      `이미지를 참조하는 문제나 결과의 개수를 확인하는 중 오류가 발생했습니다: ${err}`,
    );
    throw err;
  }
}

export function validateS3Key(fileName: string): boolean {
  // SHA-256 해시-파일이름.확장자 패턴 정의
  const pattern = /^[a-fA-F0-9]{64}-[^.]+\.[a-zA-Z0-9]+$/;
  return pattern.test(fileName);
}

export async function getPublicExamProblemResult(
  PublicExamProblemUUID: string,
) {
  try {
    const data = await drizzleSession.transaction(async (dt) => {
      const queryResult = await dt.query.result.findFirst({
        where: and(
          eq(result.uuid, PublicExamProblemUUID),
          eq(result.isPublic, true),
        ),
        with: {
          problemResults: {
            orderBy: (problemResult, { asc }) => [asc(problemResult.order)],
            with: {
              image: true,
            },
          },
        },
      });

      if (!queryResult) return null;

      const returnData: ExamResultsSet = {
        ...queryResult,
        problemSetName: queryResult.problemSetName,
        problemResults: queryResult.problemResults.map((problemResult) => ({
          uuid: problemResult.uuid,
          order: problemResult.order,
          isCorrect: problemResult.isCorrect,
          candidates: problemResult.candidates,
          subjectiveAnswered: problemResult.subjectiveAnswered,
          question: problemResult.question,
          additionalView: problemResult.additionalView,
          questionType: problemResult.questionType as "obj" | "sub",
          isAnswerMultiple: problemResult.isAnswerMultiple,
          correctCandidates: problemResult.correctCandidates,
          correctSubjectiveAnswer: problemResult.correctSubjectiveAnswer,
          image: problemResult.image,
          createdAt: problemResult.createdAt,
          updatedAt: problemResult.updatedAt,
        })),
      };

      return returnData;
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function evaluateExamProblems(
  examProblems: ExamProblem[],
  problemSetName: string,
  userEmail?: string,
) {
  try {
    const transactionResult = await drizzleSession.transaction(async (dt) => {
      const validateResult = examProblemsSchema.safeParse(examProblems);

      if (!validateResult.success) {
        throw new Error("인수로 전달된 답안들이 유효하지 않습니다.");
      }
      const date = new Date();

      let userUuid: string | null = null;
      if (userEmail) {
        userUuid = await getUserUUIDbyEmail(userEmail, dt);
      }

      const [{ uuid: resultsUuid }] = await dt
        .insert(result)
        .values({
          problemSetName,
          userUuid,
          isPublic: userUuid === null,
          createdAt: date,
          updatedAt: date,
        })
        .returning({ uuid: result.uuid });

      console.log("resultsUuid :", resultsUuid);

      await Promise.all(
        examProblems.map(async (examProblem, index) => {
          if (!examProblem || !examProblem.uuid) {
            throw new Error("something is null");
          }

          if (
            examProblem.type === "obj" &&
            examProblem.isAnswerMultiple === false
          ) {
            if (
              Array.isArray(examProblem.candidates) &&
              examProblem.candidates.filter((candidate) => candidate.isAnswer)
                .length > 1
            ) {
              throw new Error(
                "단일 선택 문제입니다. 하나의 정답만 선택해주세요.",
              );
            }
          }

          if (
            examProblem.type === "sub" &&
            typeof examProblem.subAnswer !== "string"
          ) {
            throw new Error("주관식 문제입니다. 정답을 입력해주세요.");
          }

          let evaluationResult: boolean;

          // 정답 가져오기
          const answer: CorrectAnswer = await getAnswerByProblemUuid(
            examProblem.uuid,
            dt,
          );

          if (answer === null) {
            throw new Error("정답을 찾을 수 없습니다.");
          }

          if (examProblem.type === "sub") {
            if (typeof examProblem.subAnswer !== "string") {
              throw new Error("주관식 문제입니다. 정답을 입력해주세요.");
            }
            if (examProblem.subAnswer === "") {
              evaluationResult = false;
            } else {
              const subjectiveEvaluation = await evaluateSubjectiveProblem({
                additionalView: examProblem.additionalView,
                question: examProblem.question,
                answer: isString(answer) ? answer : "",
                userAnswer: examProblem.subAnswer,
              });

              if (subjectiveEvaluation) {
                evaluationResult = subjectiveEvaluation.isCorrect;
              } else {
                throw new Error("주관식 문제 평가 중 오류가 발생했습니다.");
              }
            }
          } else {
            evaluationResult = await validateExamProblemAnswer(
              examProblem,
              answer,
            );
          }

          await postExamProblemResult({
            order: index + 1,
            dt,
            answer,
            examProblem,
            evaluationResult,
            resultsUuid,
          });
        }),
      );

      return resultsUuid;
    });

    return transactionResult;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function postExamProblemResult({
  order,
  dt,
  answer,
  examProblem,
  evaluationResult,
  resultsUuid,
}: {
  order: number;
  dt: DrizzleTransaction;
  answer: CorrectAnswer;
  examProblem: ExamProblem;
  evaluationResult: boolean;
  resultsUuid: string;
}) {
  const date = new Date();

  await dt.insert(problemResult).values({
    order,
    question: examProblem.question,
    questionType: examProblem.type,
    additionalView: examProblem.additionalView,
    resultUuid: resultsUuid,
    isCorrect: evaluationResult,
    candidates: examProblem.candidates?.map((candidate) => ({
      id: candidate.id!,
      text: candidate.text,
      isSelected: candidate.isAnswer ?? false,
    })) as ExamResultCandidate[],
    isAnswerMultiple: examProblem.isAnswerMultiple ?? false,
    imageUuid: examProblem.image?.uuid,
    subjectiveAnswered: examProblem.subAnswer,
    correctSubjectiveAnswer: typeof answer === "string" ? answer : undefined,
    correctCandidates:
      examProblem.type === "obj" &&
      Array.isArray(answer) &&
      examProblem.candidates
        ? examProblem.candidates
            .filter((candidate) => answer.includes(candidate.id))
            .map((candidate) => ({
              id: candidate.id!,
              text: candidate.text,
            }))
        : [],
    createdAt: date,
    updatedAt: date,
  });
}

export async function getProblemSetsMaxPage(
  searchString: string,
  pageSize: number,
  userUUID: string,
) {
  try {
    const totalProblemSetsCount = await drizzleSession.transaction(
      async (dt) => {
        if (searchString !== "") {
          return dt
            .select({ value: count() })
            .from(problemSet)
            .where(
              and(
                eq(problemSet.userUuid, userUUID),
                like(problemSet.name, `%${searchString}%`),
              ),
            );
        }
        return dt
          .select({ value: count() })
          .from(problemSet)
          .where(eq(problemSet.userUuid, userUUID));
      },
    );

    return Math.ceil(totalProblemSetsCount[0].value / pageSize);
  } catch (err) {
    console.log(err);
    throw new Error("문제집 페이지 수를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getResultsMaxPage(
  userEmail: string,
  pageSize: number,
  searchString: string,
) {
  try {
    const totalExamResultsCount = await drizzleSession.transaction(
      async (dt) => {
        if (searchString !== "") {
          const userUuid = await getUserUUIDbyEmail(userEmail, dt);
          return dt
            .select({ value: count() })
            .from(result)
            .where(
              and(
                eq(result.userUuid, userUuid),
                like(problemSet.name, `%${searchString}%`),
              ),
            );
        }
        const userUuid = await getUserUUIDbyEmail(userEmail, dt);
        return dt
          .select({ value: count() })
          .from(result)
          .where(eq(result.userUuid, userUuid));
      },
    );

    return Math.ceil(totalExamResultsCount[0].value / pageSize);
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과 페이지 수를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getPublicProblemSetsMaxPage(
  searchString: string,
  pageSize: number,
) {
  try {
    const totalProblemSetsCount = await drizzleSession.transaction(
      async (dt) => {
        if (searchString) {
          return dt
            .select({ value: count() })
            .from(problemSet)
            .where(
              and(
                eq(problemSet.isPublic, true),
                like(problemSet.name, `%${searchString}%`),
              ),
            );
        }
        return dt
          .select({ value: count() })
          .from(problemSet)
          .where(eq(problemSet.isPublic, true));
      },
    );

    return Math.ceil(totalProblemSetsCount[0].value / pageSize);
  } catch (err) {
    console.log(err);
    throw new Error("문제집 페이지 수를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getUserProblemSetsInfos(userUUID: string) {
  const data = await drizzleSession.transaction(async (dt) => {
    const problemSetUUIDs = await dt.query.problemSet.findMany({
      where: eq(problemSet.userUuid, userUUID),
    });

    return problemSetUUIDs.map((problemSet) => ({
      name: problemSet.name,
      uuid: problemSet.uuid,
    }));
  });

  return data;
}

// export async function getUserProblemGroupsInfos(
//   userUUID: string,
//   search?: string,
// ) {
//   const data = await drizzleSession.transaction(async (dt) => {
//     const problemGroupUUIDs = await dt.query.problemSetGroup.findMany({
//       where: (problemSetGroup, { and, eq, like }) => {
//         if (search) {
//           console.log("search : ", search);
//           return and(
//             eq(problemSetGroup.userUuid, userUUID),
//             like(problemSetGroup.name, `%${search}%`),
//           );
//         }
//         return eq(problemSetGroup.userUuid, userUUID);
//       },
//     });

//     return problemGroupUUIDs.map((problemGroup) => ({
//       name: problemGroup.name,
//       uuid: problemGroup.uuid,
//     }));
//   });

//   return data;
// }
