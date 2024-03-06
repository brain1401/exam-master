import { Prettify } from "@/utils/type";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";

export const ImageSchema = z.object({
  uuid: z.string(),
  key: z.string(),
  filename: z.string(),
  url: z.string(),
  hash: z.string(),
});

export type Candidate = {
  id: number | null;
  text: string;
  isAnswer: boolean;
};

export type Problem = {
  uuid?: string;
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  isAnswerMultiple: boolean | null;
  image: File | z.infer<typeof ImageSchema> | null;
  isAdditiondalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  candidates: Candidate[] | null;
  subAnswer: string | null;
} | null;

export type ExamProblem = z.infer<typeof examProblemSchema>;

export type ProblemSet = {
  uuid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isShareLinkPurposeSet: boolean;
  problems?: Problem[];
  examProblemsCount?: number;
};

export type ProblemSetWithPagination = {
  data: ProblemSet[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};


export type ProblemSetWithName = {
  id: string | undefined;
  name: string;
  problems: Problem[];
};

export type ExamProblemSet = {
  uuid: string | undefined;
  name: string;
  problems: ExamProblem[];
};

export const candidateSchema = z.object({
  id: z.number().nullable(),
  text: z.string(),
  isAnswer: z.boolean(),
});

export type MongoDBImageType = z.infer<typeof ImageSchema>;

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
        ImageSchema.nullable(),
      ])
      .nullable(),
    isAdditiondalViewButtonClicked: z.boolean().optional(),
    isImageButtonClicked: z.boolean().optional(),
    candidates: z.array(candidateSchema).nullable(),
    subAnswer: z.string().nullable(),
  })
  .nullable();

export const examProblemSchema = z.object({
  uuid: z.string().optional(),
  type: z.union([z.literal("obj"), z.literal("sub")]),
  question: z.string(),
  additionalView: z.string(),
  isAnswerMultiple: z.boolean().nullable(),
  image: ImageSchema.nullable(),
  candidates: z.array(candidateSchema).nullable(),
  subAnswer: z.string().nullable(),
});

export const problemsSchema = z.array(problemSchema);

export const uuidSchema = z.string().uuid();

export const CorrectCandidateSchema = z.object({
  id: z.number(),
  text: z.string(),
});
export type CorrectCandidate = z.infer<typeof CorrectCandidateSchema>;

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

export const ExamResultSchema = z.object({
  uuid: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  problemSetName: z.string(),
  user: z.string(),
  problem_results: z.array(ProblemResultSchema).optional(),
});

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

export type ExamResult = z.infer<typeof ExamResultSchema>;

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

export const ExamResultsSchema = z.array(ExamResultSchema);

export type ExamResults = z.infer<typeof ExamResultsSchema>;

export type PrismaTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
