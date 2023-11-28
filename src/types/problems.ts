import { Prettify } from "@/utils/type";
import { type } from "os";
import { z } from "zod";

export type candidate = {
  id: number | null;
  text: string;
  isAnswer: boolean;
};

export type Problem = {
  id?: number;
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  isAnswerMultiple: boolean | null;
  image:
    | File
    | {
        id: string;
        url: string;
      }
    | null;
  isAdditiondalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  candidates: candidate[] | null;
  subAnswer: string | null;
} | null;

export type ExamProblem = z.infer<typeof examProblemSchema>;

export type ProblemResponse = {
  id: number;
  question: string;
  createdAt: string;
  updatedAt: string;
  questionType: string;
  uuid: string;
  image: { id: string; url: string };
  candidates: candidate[] | null;
  additionalView: string;
  subjectiveAnswer: string | null;
  isAnswerMultiple: boolean | null;
};

export type ProblemSetResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  UUID: string;
  exam_problems?: ProblemResponse[];
  examProblemsCount?: number;
};

export type RawProblemSetResponse = {
  data: ProblemSetResponse[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type ProblemSetWithName = {
  id: number | undefined;
  name: string;
  exam_problems: Problem[];
};

export type ExamProblemSet = {
  id: number | undefined;
  name: string;
  exam_problems: ExamProblem[];
};

export const candidateSchema = z.object({
  id: z.number().nullable(),
  text: z.string(),
  isAnswer: z.boolean(),
});

export const ImageSchema = z.object({
  id: z.number(),
  name: z.string(),
  alternativeText: z.string().nullable(),
  caption: z.string().nullable(),
  width: z.number(),
  height: z.number(),
  formats: z
    .object({
      thumbnail: z
        .object({
          name: z.string(),
          hash: z.string(),
          ext: z.string(),
          mime: z.string(),
          path: z.string().nullable(),
          width: z.number(),
          height: z.number(),
          size: z.number(),
          url: z.string(),
        })
        .optional(),
      medium: z
        .object({
          name: z.string(),
          hash: z.string(),
          ext: z.string(),
          mime: z.string(),
          path: z.string().nullable(),
          width: z.number(),
          height: z.number(),
          size: z.number(),
          url: z.string(),
        })
        .optional(),
      small: z
        .object({
          name: z.string(),
          hash: z.string(),
          ext: z.string(),
          mime: z.string(),
          path: z.string().nullable(),
          width: z.number(),
          height: z.number(),
          size: z.number(),
          url: z.string(),
        })
        .optional(),
      large: z
        .object({
          name: z.string(),
          hash: z.string(),
          ext: z.string(),
          mime: z.string(),
          path: z.string().nullable(),
          width: z.number(),
          height: z.number(),
          size: z.number(),
          url: z.string(),
        })
        .optional(),
    })
    .nullable(),
  hash: z.string(),
  ext: z.string(),
  mime: z.string(),
  size: z.number(),
  url: z.string(),
  previewUrl: z.string().nullable(),
  provider: z.string(),
  provider_metadata: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type StrapiImage = z.infer<typeof ImageSchema>;

export const problemSchema = z
  .object({
    id: z.number().optional(),
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
  id: z.number().optional(),
  type: z.union([z.literal("obj"), z.literal("sub")]),
  question: z.string(),
  additionalView: z.string(),
  isAnswerMultiple: z.boolean().nullable(),
  image: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable(),
  candidates: z.array(candidateSchema).nullable(),
  subAnswer: z.string().nullable(),
});

export const problemResponseSchema = z.object({
  id: z.number(),
  question: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  questionType: z.string(),
  uuid: z.string(),
  image: z.object({
    id: z.string(),
    url: z.string(),
  }),
  candidates: z.array(candidateSchema).nullable(),
  additionalView: z.string(),
  subjectiveAnswer: z.string().nullable(),
  isAnswerMultiple: z.boolean().nullable(),
});

export const problemSetResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  UUID: z.string(),
  exam_problems: z.array(problemResponseSchema).optional(),
  examProblemsCount: z.number().optional(),
});

export const rawProblemSetResponseSchema = z.object({
  data: z.array(problemSetResponseSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }),
  }),
});

export const problemSetWithNameSchema = z.object({
  name: z.string(),
  exam_problems: z.array(problemSchema),
});

export const examProblemSetSchema = z.object({
  name: z.string(),
  exam_problems: z.array(examProblemSchema),
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

export const ExamProblemResultSchema = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  isCorrect: z.boolean(),
  candidates: z.array(ExamResultCandidateSchema).nullable(),
  question: z.string(),
  questionType: z.union([z.literal("obj"), z.literal("sub")]),
  additionalView: z.string().nullable(),
  isAnswerMultiple: z.boolean(),
  subjectiveAnswered: z.string().nullable(),
  correctCandidates: z.array(CorrectCandidateSchema).nullable(),
  correctSubjectiveAnswer: z.string().nullable(),
  image: z.array(ImageSchema).nullable(),
});
export type ExamProblemResult = Prettify<
  z.infer<typeof ExamProblemResultSchema>
>;

export const ExamResultSchema = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  problemSetName: z.string(),
  uuid: z.string(),
  exam_problem_results: z.array(ExamProblemResultSchema).optional(),
});
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


export const ExamResultsResponseSchema = z.object({
  data: z.array(ExamResultSchema),
  meta: MetaSchema,
});
export type ExamResultsResponse = z.infer<typeof ExamResultsResponseSchema>;

export const ExamResultsSchema = z.array(ExamResultSchema);

export type ExamResults = z.infer<typeof ExamResultsSchema>;