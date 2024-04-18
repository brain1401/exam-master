import { Prettify } from "@/utils/type";
import drizzleSession from "@/db/drizzle";
import { z } from "zod";

export const candidateSchema = z.object({
  id: z.number().nullable(),
  text: z.string(),
  isAnswer: z.boolean().optional(),
});

export const ImageSchema = z.object({
  uuid: z.string(),
  key: z.string(),
  filename: z.string(),
  url: z.string(),
  hash: z.string(),
});

export const examProblemSchema = z.object({
  order: z.number(),
  uuid: z.string(),
  type: z.union([z.literal("obj"), z.literal("sub")]),
  question: z.string(),
  additionalView: z.string(),
  isAnswerMultiple: z.boolean().nullable(),
  image: ImageSchema.nullable(),
  candidates: z.array(candidateSchema).nullable(),
  subAnswer: z.string().nullable(),
});

export type ExamProblem = z.infer<typeof examProblemSchema>;

export const examProblemsSchema = z.array(examProblemSchema);

export type CorrectAnswer = string | (number | null)[] | null;

export const CorrectCandidateSchema = z.object({
  id: z.number(),
  text: z.string(),
});

export type CorrectCandidate = z.infer<typeof CorrectCandidateSchema>;

export type ImageURL = z.infer<typeof ImageSchema>;

export type Candidate = z.infer<typeof candidateSchema>;

export type Problem = {
  uuid?: string;
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  isAnswerMultiple: boolean | null;
  image: File | z.infer<typeof ImageSchema> | { key: string } | null;
  isAdditionalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  candidates: Candidate[] | null;
  subAnswer: string | null;
} | null;

export type ProblemWithoutImageFile = Prettify<{
  order: number;
  uuid?: string;
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  isAnswerMultiple: boolean | null;
  image: z.infer<typeof ImageSchema> | null;
  isAdditionalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  candidates: Candidate[] | null;
  subAnswer: string | null;
}>;

export type ProblemReplacedImageKey = Prettify<
  | (Omit<NonNullable<Problem>, "image"> & {
      image: { key: string } | null;
    })
  | null
>;

export type ProblemReplacedImageKeyAndFile = Prettify<
  | (Omit<NonNullable<Problem>, "image"> & {
      image: { key: string } | File | null;
    })
  | null
>;

export type ExamProblemSet = {
  uuid: string | undefined;
  name: string;
  timeLimit: number | null;
  updatedAt: Date;
  creator: string;
  description: string;
  problems: ExamProblem[];
};

export type PrefetchPaginationType =
  | "manage"
  | "exam"
  | "results"
  | "publicProblemSet";

export type SortType = "popular" | "newest";

export type ProblemSet = {
  uuid: string;
  name: string;
  timeLimit: number | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  problems?: Problem[];
  examProblemsCount?: number;
};

export type ProblemSetWithCreatedBy = Prettify<
  Omit<ProblemSet, "createdAt"> & {
    likes: number;
  }
>;

export type ProblemSetWithPagination = {
  data: ProblemSet[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type PublicProblemSetWithPagination = Prettify<
  Omit<ProblemSetWithPagination, "data"> & {
    data: ProblemSetWithCreatedBy[];
  }
>;

export type ProblemSetWithName = Prettify<{
  uuid: string;
  name: string;
  userName: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic: boolean;
  description?: string;
  timeLimit?: number | null;
  problems: ProblemWithoutImageFile[];
}>;

export type ProblemSetComment = {
  uuid: string;
  content: string;
  createdAt: Date;
  userUUID: string;
  userName: string;
};

export const problemSchema = z
  .object({
    id: z.string().optional(),
    type: z.union([z.literal("obj"), z.literal("sub")]),
    question: z.string(),
    additionalView: z.string().nullable(),
    isAnswerMultiple: z.boolean(),
    image: z
      .union([
        z.instanceof(File),
        z.array(ImageSchema).nullable(),
        z.object({ key: z.string() }),
        ImageSchema.nullable(),
      ])
      .nullable(),
    isAdditionalViewButtonClicked: z.boolean().optional(),
    isImageButtonClicked: z.boolean().optional(),
    candidates: z.array(candidateSchema).nullable(),
    subAnswer: z.string().nullable(),
  })
  .nullable();

export const problemsSchema = z.array(problemSchema);

export const uuidSchema = z.string().uuid();

export const ExamResultCandidateSchema = z.object({
  id: z.number(),
  text: z.string(),
  isSelected: z.boolean(),
});
export type ExamResultCandidate = z.infer<typeof ExamResultCandidateSchema>;

export const ProblemResultSchema = z.object({
  uuid: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isCorrect: z.boolean(),
  candidates: z.array(ExamResultCandidateSchema).nullable(),
  question: z.string(),
  questionType: z.union([z.literal("obj"), z.literal("sub")]),
  additionalView: z.string().nullable(),
  isAnswerMultiple: z.boolean(),
  subjectiveAnswered: z.string().nullable(),
  correctCandidates: z.array(CorrectCandidateSchema).nullable(),
  correctSubjectiveAnswer: z.string().nullable(),
  image: ImageSchema.nullable(),
});
export type ProblemResult = Prettify<z.infer<typeof ProblemResultSchema>>;

export const ExamResultsSetSchema = z.object({
  uuid: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  problemSetName: z.string(),
  userUuid: z.string().uuid().nullable(),
  problemResults: z.array(ProblemResultSchema),
});
export type ExamResultsSet = Prettify<z.infer<typeof ExamResultsSetSchema>>;

export const ResultWithCountSchema = z.object({
  uuid: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  problemSetName: z.string(),
  problemResultsCount: z.number(),
});
export type ResultWithCount = z.infer<typeof ResultWithCountSchema>;

export type ResultsWithPagination = {
  data: ResultWithCount[];
  pagination: Pagination;
};

export const QuestionTypeSchema = z.enum(["obj", "sub"]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const MetaSchema = z.object({
  pagination: PaginationSchema,
});
export type Meta = z.infer<typeof MetaSchema>;

export const ExamResultsWithCountResponseSchema = z.object({
  data: z.array(ResultWithCountSchema),
  meta: MetaSchema,
});
export type ExamResultsWithCountResponse = z.infer<
  typeof ExamResultsWithCountResponseSchema
>;

type TransactionCallback = Parameters<typeof drizzleSession.transaction>[0];

export type DrizzleTransaction = Parameters<TransactionCallback>[0];

export type PresignedPostAlreadyExistsCallback<T> = (
  key: string,
) => Promise<T> | T;

export type ExamProblemAnswer = {
  uuid: string;
  answer: ExamProblem["candidates"] | ExamProblem["subAnswer"];
};

export type toBeCallbacked = {
  index: number;
  isUnique: boolean;
  isFirstImage: boolean | null;
  isNoImage: boolean;
  imageKey: string | null;
  imageFile: File | null;
  duplicateIndexes: number[];
  toBeCallbacked: toBeCallbackedItSelf[];
};

export type toBeCallbackedItSelf = {
  index: number;
  isUnique: boolean;
  isFirstImage: boolean | null;
  isNoImage: boolean;
  imageKey: string | null;
  imageFile: File | null;
  duplicateIndexes: number[];
};

/**
 * 업로드된 이미지 타입입니다.
 *
 * @typedef {Object} UploadedImage
 * @property {number} index - 이미지의 인덱스입니다.
 * @property {string | null} imageKey - 이미지 키입니다. `null`일 수도 있습니다.
 */

/**
 * 콜백 함수 타입 `HandleDuplicateImageCallback`은 이미지 처리를 위한 콜백 함수입니다.
 *
 * @template T - 콜백 함수의 반환 타입입니다.
 *
 * @param toBeCallbackedImage - 콜백 함수에 전달되는 객체입니다.
 * @param toBeCallbackedImage.index - Problem[]에서의 해당하는 이미지의 인덱스입니다.
 * @param toBeCallbackedImage.imageKey - 이미지의 키 값입니다.
 * @param toBeCallbackedImage.image - 이미지 파일입니다.
 * @param toBeCallbackedImage.duplicateOf - 중복 이미지의 인덱스입니다. 중복 이미지가 아닌 경우에는 `null`입니다. 해당 문제에 이미지 파일이 없는 경우에는 `undefined`입니다.
 *
 * @returns Promise<T | undefined> - 콜백 함수의 반환 값입니다.
 */
export type HandleImageCallback<T> = (
  toBeCallbackedImage: toBeCallbacked,
) => Promise<T>;

export const QuestionSchema = z.object({
  type: z.string(),
  question: z.string(),
  options: z.union([z.array(z.string()), z.null()]).optional(),
  answer: z.union([z.array(z.number()), z.string()]),
  explanation: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const GenerateQuestionResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});
export type GenerateQuestionResponse = z.infer<
  typeof GenerateQuestionResponseSchema
>;

export const GenerateQuestionResponsesSchema = z.array(
  GenerateQuestionResponseSchema,
);

export type GenerateQuestionResponses = z.infer<
  typeof GenerateQuestionResponsesSchema
>;

export type UpdateProblemsSetData = {
  problems: ProblemReplacedImageKey[];
  problemSetName: string;
  problemSetIsPublic: boolean;
  timeLimit: string;
  description: string;
  problemSetUUID?: string;
};
