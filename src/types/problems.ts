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

export type ExamProblem = {
  id?: number;
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  isAnswerMultiple: boolean | null;
  image: {
    id: string;
    url: string;
  } | null;
  candidates: candidate[] | null;
  subAnswer: string | null;
};

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
  id: string;
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
  name: string;
  exam_problems: Problem[];
};

export type ExamProblemSet = {
  name: string;
  exam_problems: ExamProblem[];
};

export const candidateSchema = z.object({
  id: z.number().nullable(),
  text: z.string(),
  isAnswer: z.boolean(),
});

export const problemSchema = z
  .object({
    id: z.number().optional(),
    type: z.union([z.literal("obj"), z.literal("sub")]),
    question: z.string(),
    additionalView: z.string(),
    isAnswerMultiple: z.boolean().nullable(),
    image: z
      .union([
        z.instanceof(File),
        z.object({
          id: z.number(),
          name: z.string(),
          alternativeText: z.null(),
          caption: z.null(),
          width: z.number(),
          height: z.number(),
          formats: z.object({
            thumbnail: z.object({
              name: z.string(),
              hash: z.string(),
              ext: z.string(),
              mime: z.string(),
              path: z.null(),
              width: z.number(),
              height: z.number(),
              size: z.number(),
              url: z.string(),
            }),
            medium: z.object({
              name: z.string(),
              hash: z.string(),
              ext: z.string(),
              mime: z.string(),
              path: z.null(),
              width: z.number(),
              height: z.number(),
              size: z.number(),
              url: z.string(),
            }),
            small: z.object({
              name: z.string(),
              hash: z.string(),
              ext: z.string(),
              mime: z.string(),
              path: z.null(),
              width: z.number(),
              height: z.number(),
              size: z.number(),
              url: z.string(),
            }),
            large: z.object({
              name: z.string(),
              hash: z.string(),
              ext: z.string(),
              mime: z.string(),
              path: z.null(),
              width: z.number(),
              height: z.number(),
              size: z.number(),
              url: z.string(),
            }),
          }),
          hash: z.string(),
          ext: z.string(),
          mime: z.string(),
          size: z.number(),
          url: z.string(),
          previewUrl: z.null(),
          provider: z.string(),
          provider_metadata: z.null(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      ])
      .nullable(),
    isAdditiondalViewButtonClicked: z.boolean(),
    isImageButtonClicked: z.boolean(),
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
