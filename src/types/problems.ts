export type candidate = {
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

export type ProblemSet = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  UUID: string;
  exam_problems?: {
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
  }[];
  examProblemsCount?: number;
};

export type ProblemSetResponse = {
  data: ProblemSet[];
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
