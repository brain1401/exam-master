import {
  Problem,
  ExamProblem,
  ProblemSetWithPagination,
  Candidate,
  PrismaTransaction,
  ResultsWithPagination,
} from "@/types/problems";
import {
  getUserByEmail,
} from "./user";
import {
  generateFileHash,
  isAnswerArray,
  isAnswerString,
  isImageFileObject,
  isImageUrlObject,
} from "@/utils/problems";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import prisma from "@/lib/prisma";
import { s3Client } from "@/utils/AWSs3Client";


export async function postProblems(
  setName: string,
  userEmail: string,
  problems: Problem[],
  isShareLinkPurposeSet: boolean,
) {
  try {
    const result = await prisma.$transaction(
      async (pm) => {
        console.time("createProblemSet");
        const createdProblemSet = await pm.problemSet.create({
          data: {
            name: setName,
            user: {
              connect: {
                email: userEmail,
              },
            },
            problems: {
              create: await Promise.all(
                problems.map(async (problem, index) => {
                  if (!problem) throw new Error("문제가 null입니다!");

                  return {
                    questionType: problem.type,
                    question: problem.question,
                    candidates: problem.candidates ?? undefined,
                    additionalView: problem.additionalView,
                    subjectiveAnswer: problem.subAnswer,
                    isAnswerMultiple: problem.isAnswerMultiple ?? undefined,
                    order: index + 1,
                    image: problem.image
                      ? {
                          connect: {
                            uuid: (
                              await createImageIfNotExist(
                                problem.image,
                                userEmail,
                                pm,
                              )
                            ).uuid,
                          },
                        }
                      : undefined,
                    user: {
                      connect: {
                        email: userEmail,
                      },
                    },
                  };
                }),
              ),
            },
            isShareLinkPurposeSet: isShareLinkPurposeSet,
          },
          select: {
            uuid: true,
          },
        });
        console.timeEnd("createProblemSet");

        return createdProblemSet ? "OK" : "FAIL";
      },
      {
        timeout: 20000, // 20초
      },
    );

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("문제를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function createImageIfNotExist(
  image: any,
  userEmail: string,
  pm: PrismaTransaction,
) {
  console.log("createImageIfNotExist 함수 시작");
  const prismaInstance = pm;

  try {
    if (image && isImageFileObject(image)) {
      // 이미지가 파일 타입인 경우
      console.log("[createImageIfNotExist] 이미지가 파일 타입인 경우");
      const [hash, { uuid: userUuid }] = await Promise.all([
        generateFileHash(image),
        getUserByEmail(userEmail, prismaInstance),
      ]);

      const imageKey = `${hash}-${image.name}`;
      console.log("[createImageIfNotExist] imageKey :", imageKey);

      const [checkIfImageExistsOnS3, checkIfImageExistsOnDB] =
        await Promise.all([
          checkIfImageExistsOnS3ByImageKey(imageKey),
          checkIfImageExistsOnDBByImageKey(imageKey, prismaInstance),
        ]);

      if (!checkIfImageExistsOnS3 && !checkIfImageExistsOnDB) {
        // 넣으려고 하는 이미지가 s3와 prisma에 없는 경우
        console.log(
          `[createImageIfNotExist] 넣으려고 하는 이미지${image.name}가 s3와 prisma에 없는 경우`,
        );
        try {
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKey,
            Body: (await image.arrayBuffer()) as Buffer,
            ContentType: image.type,
          });

          const response = await s3Client.send(command);
          if (!(response.$metadata.httpStatusCode === 200))
            throw new Error(
              "[createImageIfNotExist] S3에 이미지를 생성하는 중 오류가 발생했습니다.",
            );

          const result = await prismaInstance.image.upsert({
            where: {
              key: imageKey,
            },
            create: {
              key: imageKey,
              url: `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${encodeURIComponent(imageKey)}`,
              hash: hash,
              filename: image.name,
              users: {
                connect: {
                  email: userEmail,
                },
              },
            },
            update: {},
            select: {
              uuid: true,
            },
          });

          console.log(`[createImageIfNotExist] 이미지 ${image.name} 생성 성공`);

          return result;
        } catch (err) {
          console.log(
            "s3에 이미지를 업로드 하는 중 오류 발생, 이미지 삭제 시도..",
          );
          console.error(err);
          const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKey,
          });

          const response = await s3Client.send(command);

          if (!(response.$metadata.httpStatusCode === 204)) {
            throw new Error(
              `[createImageIfNotExist] S3에서 이미지${image.name}를 삭제하는 중 오류가 발생했습니다.`,
            );
          } else {
            console.log(
              `[createImageIfNotExist] 이미지${image.name} 삭제 성공`,
            );
          }

          throw new Error(
            `[createImageIfNotExist] 이미지${image.name}를 생성하는 중 오류가 발생했습니다.`,
          );
        }
      } else if (checkIfImageExistsOnS3 && checkIfImageExistsOnDB) {
        //넣으려고 하는 이미지가 s3에 있는 경우 (이미 데이터베이스에 있는 경우)
        console.log(
          `[createImageIfNotExist] 넣으려고 하는 이미지 ${image.name}가 s3에 있는 경우 (이미 데이터베이스에 있는 경우)`,
        );
        const imageUuid = await getImageUuidByImageKey(
          imageKey,
          prismaInstance,
        );
        if (!imageUuid)
          throw new Error(
            `[createImageIfNotExist] 이미지 uuid ${image.name}를 찾는 중 오류가 발생했습니다.`,
          );

        const result = await prismaInstance.image.update({
          where: {
            uuid: imageUuid,
          },
          data: {
            users: {
              connect: {
                email: userEmail,
              },
            },
          },
          select: {
            uuid: true,
          },
        });

        console.log(
          `[createImageIfNotExist] 데이터베이스에 이미 이미지가 있어 이미지${imageKey}와 유저${userEmail}를 연결했습니다.`,
        );
        return result;
      } else {
        throw new Error(
          `[createImageIfNotExist] 이미지가 s3와 DB에 동기화되어있지 않습니다!\n s3:${checkIfImageExistsOnS3} DB:${checkIfImageExistsOnDB}`,
        );
      }
    } else if (image && isImageUrlObject(image)) {
      // 이미지가 URL 타입인 경우
      console.log("[createImageIfNotExist] 이미지가 URL 타입인 경우");
      const imageUuid = await getImageUuidByImageKey(image.key, prismaInstance);
      console.log("[createImageIfNotExist] imageKey :", image.key);
      console.log("[createImageIfNotExist] imageUuid :", imageUuid);
      if (!imageUuid)
        throw new Error(
          "[createImageIfNotExist] 이미지 uuid를 찾는 중 오류가 발생했습니다.",
        );

      const result = await prismaInstance.image.update({
        where: {
          uuid: imageUuid,
        },
        data: {
          users: {
            connect: {
              email: userEmail,
            },
          },
        },
        select: {
          uuid: true,
        },
      });

      console.log(
        `[createImageIfNotExist] 이미지${image.key}와 유저${userEmail}를 연결했습니다.`,
      );

      return result;
    } else {
      throw new Error("[createImageIfNotExist] 이미지가 없습니다.");
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
    const result = await prisma.problemSet.findMany({
      where: {
        name: name,
        user: {
          email: userEmail,
        },
      },
    });

    return result.length > 0 ? true : false;
  } catch (err) {
    console.log(err);
    throw new Error("문제집 이름을 확인하는 중 오류가 발생했습니다.");
  }
}

export async function checkIfImageExistsOnDBByImageKey(
  imageKey: string,
  pm?: PrismaTransaction,
) {
  const prismaInstance = pm ?? prisma;
  try {
    const result = await prismaInstance.image.findFirst({
      where: {
        key: imageKey,
      },
    });

    return result ? true : false;
  } catch (err) {
    console.log(err);
    throw new Error("이미지를 확인하는 중 오류가 발생했습니다.");
  }
}

export async function checkIfImageExistsOnS3ByImageKey(imageKey: string) {
  try {
    const result = await s3Client.send(
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
    const [totalProblemSetsCount, problemSets] = await Promise.all([
      prisma.problemSet.count({
        where: {
          user: {
            email: userEmail,
          },
        },
      }),
      prisma.problemSet.findMany({
        where: {
          user: {
            email: userEmail,
          },
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
        include: {
          problems: {
            orderBy: {
              order: "asc",
            },
            include: {
              image: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
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
    const problemSets = await prisma.problemSet.findMany({
      where: {
        name: {
          contains: name,
        },
        user: {
          email: userEmail,
        },
      },
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
      include: {
        problems: {
          include: {
            image: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
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
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function getProblemsSetByUUID(uuid: string, userEmail: string) {
  // filter 조건에 userEmail을 추가해서 해당 유저의 문제집만 가져오도록 했음

  try {
    const problemSet = await prisma.problemSet.findFirst({
      where: {
        uuid: uuid,
        user: {
          email: userEmail,
        },
      },
      include: {
        problems: {
          orderBy: {
            order: "asc",
          },
          include: {
            image: true,
          },
        },
      },
    });

    if (!problemSet) {
      throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
    }

    const returnData = {
      uuid: problemSet.uuid,
      name: problemSet.name,
      createdAt: problemSet.createdAt,
      updatedAt: problemSet.updatedAt,
      isShareLinkPurposeSet: problemSet.isShareLinkPurposeSet,
      problems: problemSet.problems.map((problem) => ({
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
  } catch (err) {
    console.log(err);
    throw new Error("문제집을 불러오는 중 오류가 발생했습니다.");
  }
}

export async function updateProblems(
  setName: string,
  replacingProblems: Problem[],
  problemSetUUID: string,
  userEmail: string,
) {
  console.log("문제 업데이트 시작!");

  try {
    console.log("문제 업데이트 트랜잭션 시작");
    const result = await prisma.$transaction(
      async (pm) => {
        console.log("기존 문제 불러오기 시작");
        const oldProblems = (
          await pm.problem.findMany({
            where: {
              problemSet: {
                uuid: problemSetUUID,
              },
            },
            select: {
              uuid: true,
              image: true,
              order: true,
            },
          })
        ).map((problem) => ({
          uuid: problem.uuid,
          image: problem.image,
          order: problem.order,
        }));
        console.log(
          "oldProblems : ",
          oldProblems.sort((a, b) => a.order - b.order),
        );

        const newProblems = await Promise.all(
          replacingProblems.map(async (problem, index) => {
            if (!problem) throw new Error("문제가 null입니다!");

            console.log(`문제 ${index + 1} 생성 시작`);

            const result = await pm.problem.create({
              data: {
                order: index + 1,
                question: problem.question,
                questionType: problem.type,
                candidates: problem.candidates ?? undefined,
                additionalView: problem.additionalView,
                subjectiveAnswer: problem.subAnswer,
                isAnswerMultiple: problem.isAnswerMultiple ?? undefined,
                image: problem.image
                  ? {
                      connect: {
                        uuid: (
                          await createImageIfNotExist(
                            problem.image,
                            userEmail,
                            pm,
                          )
                        ).uuid,
                      },
                    }
                  : undefined,
                user: {
                  connect: {
                    email: userEmail,
                  },
                },
                problemSet: {
                  connect: {
                    uuid: problemSetUUID,
                  },
                },
              },
              include: {
                image: true,
              },
            });
            console.log(`문제 ${index + 1} 생성 완료,`, result);
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
        ].reduce((acc, cur) => {
          const newProblemsImageKey = newProblems.reduce((acc, cur) => {
            if (cur.image) acc.push(cur.image.key);
            return acc;
          }, [] as string[]);

          if (!newProblemsImageKey.includes(cur)) acc.push(cur);
          return acc;
        }, [] as string[]);

        console.log("toBeDeletedImageKey : ", toBeDeletedImageKey);

        if (toBeDeletedImageKey.length > 0) {
          await deleteImagesFromSet(toBeDeletedImageKey, userEmail, 1, pm);
        }

        if (oldProblems.length > 0) {
          console.log(`기존 문제들 삭제 시작`, oldProblems);
          const result = await pm.problemSet.update({
            where: {
              uuid: problemSetUUID,
            },
            data: {
              name: setName,
              problems: {
                deleteMany: {
                  uuid: {
                    in: oldProblems.map((problem) => problem.uuid),
                  },
                },
              },
            },
          });
          if (!result) throw new Error("문제 업데이트 중 오류 발생");
        }

        console.log("기존 문제 삭제 완료");
        return true;
      },
      {
        timeout: 20000, // 20초
      },
    );

    return result;
  } catch (err) {
    console.error("오류 발생:", err);
    throw new Error("문제 업데이트 중 오류 발생");
  }
}

async function getImageUuidByImageKey(
  imageKey: string,
  pm?: PrismaTransaction,
) {
  try {
    const prismaInstance = pm ?? prisma;
    const result = await prismaInstance.image.findFirst({
      where: {
        key: imageKey,
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

async function getImageFileOnS3ByImageKey(imageKey: string) {
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
    const result = await prisma.problemSet.findFirst({
      where: {
        uuid: problemSetUUID,
        user: {
          email: userEmail,
        },
      },
    });

    return result ? "OK" : "NO";
  } catch (err) {
    console.log(err);
    throw new Error("유저를 검증하는 중 오류가 발생했습니다.");
  }
}

export async function getAnswerByProblemUuid(
  problemUuid: string,
  pm?: PrismaTransaction,
) {
  const prismaInstance = pm ?? prisma;
  try {
    const problem = await prismaInstance.problem.findFirst({
      where: {
        uuid: problemUuid,
      },
      select: {
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

type ProblemsAndSetsName = {
  problemSetsName: string;
  problems: Problem[];
};

type ProblemsAndSetsNameWithUUID = ProblemsAndSetsName & {
  problemSetUUID: string;
};

export function getParsedProblems<T extends boolean>(
  formData: FormData,
  includeUuid: T,
): T extends true ? ProblemsAndSetsNameWithUUID : ProblemsAndSetsName {
  const entries = Array.from(formData.entries());

  const problems: NonNullable<Problem>[] = [];
  let problemSetsName: string | undefined;
  let problemSetUUID: string | undefined;

  for (const [name, value] of entries) {
    if (name === "problemSetsName") {
      problemSetsName = value as string;
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

      if (!problems[index]) {
        problems[index] = {} as NonNullable<Problem>;
      }

      if (prefix === "data") {
        const ProblemData = JSON.parse(value as string);
        problems[index] = {
          ...problems[index],
          ...ProblemData,
        };
      } else if (prefix === "image" && value !== "null") {
        problems[index].image = value as File;
      }
    }
  }

  if (includeUuid) {
    return { problemSetsName, problems, problemSetUUID } as T extends true
      ? ProblemsAndSetsNameWithUUID
      : ProblemsAndSetsName;
  } else {
    return { problemSetsName, problems } as T extends true
      ? ProblemsAndSetsNameWithUUID
      : ProblemsAndSetsName;
  }
}

export async function postProblemResult(
  order: number,
  problem: ExamProblem,
  resultsUuid: string,
  result: boolean,
  answer: string | (number | null)[],
  userUuid: string,
  pm: PrismaTransaction,
) {
  if (!problem || !problem.uuid) throw new Error("something is null");

  try {
    const problemResult = await pm.problemResult.create({
      data: {
        order: order,
        result: {
          connect: {
            uuid: resultsUuid,
          },
        },
        isCorrect: result,
        user: {
          connect: {
            uuid: userUuid,
          },
        },
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
        image: isImageUrlObject(problem.image)
          ? {
              connect: {
                uuid: problem.image.uuid,
              },
            }
          : undefined,
      },
      select: {
        uuid: true,
      },
    });

    if (!problemResult)
      throw new Error("문제 결과를 생성하는 중 오류가 발생했습니다.");
  } catch (err) {
    console.log(err);
    throw new Error("문제 결과를 생성하는 중 오류가 발생했습니다.");
  }
}

export async function getExamResultsByUUID(uuid: string, userEmail: string) {
  try {
    const result = await prisma.result.findFirst({
      where: {
        uuid: uuid,
        user: {
          email: userEmail,
        },
      },
      include: {
        problem_results: {
          orderBy: {
            order: "asc",
          },
          include: {
            image: true,
          },
        },
      },
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
) {
  try {
    const [totalExamResultsCount, examResults] = await Promise.all([
      prisma.result.count({
        where: {
          user: {
            email: userEmail,
          },
        },
      }),
      prisma.result.findMany({
        where: {
          user: {
            email: userEmail,
          },
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
        include: {
          problem_results: {
            orderBy: {
              order: "asc",
            },
            include: {
              image: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    const result: ResultsWithPagination = {
      data: examResults.map((examResult) => ({
        uuid: examResult.uuid,
        problemResultsCount: examResult.problem_results.length,
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

    return result;
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
    const [totalExamResultsCount, examResults] = await Promise.all([
      prisma.result.count({
        where: {
          user: {
            email: userEmail,
          },
          problemSetName: {
            contains: name,
          },
        },
      }),
      prisma.result.findMany({
        where: {
          user: {
            email: userEmail,
          },
          problemSetName: {
            contains: name,
          },
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
        include: {
          problem_results: {
            orderBy: {
              order: "asc",
            },
            include: {
              image: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    const result: ResultsWithPagination = {
      data: examResults.map((examResult) => ({
        uuid: examResult.uuid,
        problemResultsCount: examResult.problem_results.length,
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

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("시험 결과를 불러오는 중 오류가 발생했습니다.");
  }
}

export async function deleteImagesFromSet(
  images: string[],
  userEmail: string,
  deleteSetCount: number,
  pm: PrismaTransaction,
) {
  let problemFileImages: ({ imageFile: File; imageKey: string } | null)[] = [];
  const prismaInstance = pm;
  const s3 = s3Client;
  console.log("[deleteImagesFromSet] 이미지 삭제 시작");

  try {
    // 삭제 실패에 대비하여 이미지 파일 복사
    console.time("이미지 삭제 실패 대비 이미지 복사 시간");
    problemFileImages = await Promise.all(
      images.map(async (imageKey) => {
        if (!imageKey) return null;
        return {
          imageFile: await getImageFileOnS3ByImageKey(imageKey),
          imageKey: imageKey,
        };
      }),
    );
    console.timeEnd("이미지 삭제 실패 대비 이미지 복사 시간");

    // 이미지가 다른곳에서 참조되는지 확인하고 참조가 없으면 삭제
    await Promise.all(
      images.map(async (imageKey) => {
        if (imageKey) {
          const totalReference = await getReferecesOfImageByImageKey(
            imageKey,
            prismaInstance,
          );

          console.log(
            `[deleteImagesFromSet] 이미지 ${imageKey} totalReference :`,
            totalReference,
          );

          const imageUuid = await getImageUuidByImageKey(
            imageKey,
            prismaInstance,
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

          if (totalReference.allUserCount.total === deleteSetCount) {
            // 모든 유저의 이미지 참조가 삭제할 세트 숫자만큼인 경우 경우 s3에서 이미지 삭제 (s3 삭제 대상)
            console.log(
              `[deleteImagesFromSet] 참조가 없어 이미지 ${imageKey} 삭제 시작`,
            );

            const command = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: imageKey,
            });

            const response = await s3.send(command);
            if (!(response.$metadata.httpStatusCode === 204))
              throw new Error(
                "S3에서 이미지를 삭제하는 중 오류가 발생했습니다.",
              );
            console.log(`[deleteImagesFromSet] 이미지 ${imageKey} s3에서 삭제 성공`);

            await prismaInstance.image.delete({
              where: {
                uuid: imageUuid,
              },
            });
            console.log(
              `[deleteImagesFromSet] 이미지 ${imageKey} image 테이블에서 삭제 성공`,
            );

            console.log(`[deleteImagesFromSet] 이미지 ${imageKey} 삭제 성공`);
          }

          if (currentUserImageReference === deleteSetCount) {
            //해당하는 user테이블에서 problem테이블과 problem_result에 연결된 이미지가 삭제 대상이면 user테이블에서 이미지 연결 해제

            console.log(
              `[deleteImagesFromSet] user테이블에서 image ${imageKey}연결 해제 시작`,
            );
            await prismaInstance.user.update({
              where: {
                email: userEmail,
              },
              data: {
                images: {
                  disconnect: {
                    uuid: imageUuid,
                  },
                },
              },
            });
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
  console.log("[deleteProblemSet] 함수 시작");
  try {
    const result = await prisma.$transaction(async (pm) => {
      // 문제집 안의 문제들 찾기
      const allProblemsSet = await pm.problemSet.findMany({
        where: {
          uuid: {
            in: problemSetUUIDs,
          },
          user: {
            email: userEmail,
          },
        },
        select: {
          problems: {
            select: {
              image: true,
            },
          },
        },
      });
      if (allProblemsSet.length === 0)
        throw new Error("문제집들을 찾는 중 오류가 발생했습니다.");

      const toBeDeletedImage = {
        problemSetCount: allProblemsSet.length,
        imageKeys: [
          ...new Set(
            allProblemsSet.reduce((acc, cur) => {
              const imageKeys = cur.problems.reduce((acc, cur) => {
                if (cur.image) {
                  acc.push(cur.image.key);
                }
                return acc;
              }, [] as string[]);
              acc.push(...imageKeys);
              return acc;
            }, [] as string[]),
          ),
        ],
      };

      console.log("[deleteProblemSets] toBeDeletedImage: ", toBeDeletedImage);

      // 문제집 안의 문제 이미지들 삭제
      if (toBeDeletedImage.imageKeys.length > 0) {
        await deleteImagesFromSet(
          toBeDeletedImage.imageKeys,
          userEmail,
          toBeDeletedImage.problemSetCount,
          pm,
        );
      }

      await pm.problemSet.deleteMany({
        where: {
          uuid: {
            in: problemSetUUIDs,
          },
          user: {
            email: userEmail,
          },
        },
      });
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
    const result = await prisma.$transaction(async (pm) => {
      const AllResults = await pm.result.findMany({
        where: {
          uuid: {
            in: resultUUIDs,
          },

          user: {
            email: userEmail,
          },
        },
        select: {
          problem_results: {
            select: {
              image: true,
            },
          },
        },
      });

      if (AllResults.length === 0)
        throw new Error("시험 결과를 찾는 중 오류가 발생했습니다.");

      console.log("[AllResults] : ", AllResults);

      const toBeDeletedImage = {
        resultsCount: AllResults.length,
        imageKeys: [
          ...new Set(
            AllResults.reduce((acc, cur) => {
              const imageKeys = cur.problem_results.reduce((acc, cur) => {
                if (cur.image) {
                  acc.push(cur.image.key);
                }
                return acc;
              }, [] as string[]);
              acc.push(...imageKeys);
              return acc;
            }, [] as string[]),
          ),
        ],
      };
      console.log(
        "[deleteProblemResults] toBeDeletedImage : ",
        toBeDeletedImage,
      );

      if (toBeDeletedImage.imageKeys.length > 0) {
        await deleteImagesFromSet(
          toBeDeletedImage.imageKeys,
          userEmail,
          toBeDeletedImage.resultsCount,
          pm,
        );
      }

      await pm.result.deleteMany({
        where: {
          uuid: {
            in: resultUUIDs,
          },
        },
      });
      console.log(`[deleteProblemResults] 시험 결과 ${resultUUIDs} 삭제 성공`);
      return true;
    });

    return result;
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
  pm?: PrismaTransaction,
) {
  const prismaInstance = pm ?? prisma;
  try {
    const result = await prismaInstance.image.findFirst({
      where: {
        uuid: imageUuid,
      },
      select: {
        problems: {
          select: {
            problemSet: {
              select: {
                uuid: true,
              },
            },
          },
        },
        problem_results: {
          select: {
            result: {
              select: {
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

    const problemResultsCount = result.problem_results.reduce((acc, cur) => {
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

export async function getReferecesOfImageByImageKey(
  imageKey: string,
  pm: PrismaTransaction,
) {
  const prismaInstance = pm ?? prisma;
  try {
    const users = await prismaInstance.user.findMany({
      where: {
        images: {
          some: {
            key: imageKey,
          },
        },
      },
      select: {
        problems: {
          select: {
            problemSet: {
              select: {
                uuid: true,
              },
            },
          },
        },
        problem_results: {
          select: {
            result: {
              select: {
                uuid: true,
              },
            },
          },
        },
        uuid: true,
        email: true,
      },
    });

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

        const problemResultsCount = user.problem_results.reduce((acc, cur) => {
          if (!acc.includes(cur.result.uuid)) {
            acc.push(cur.result.uuid);
          }
          return acc;
        }, [] as string[]).length;

        return {
          userEmail: user.email,
          userUuid: user.uuid,
          count: {
            total: problemSetCount + problemResultsCount,
            problemSetCount,
            problemResultsCount,
          },
        };
      }),
    };

    return {
      ...result,
      allUserCount: {
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
      },
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