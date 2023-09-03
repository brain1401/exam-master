export type candidate = {
  text: string;
  isAnswer: boolean;
};

export type Card = {
  type: "obj" | "sub";
  question: string;
  additionalView: string;
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

export type ProblemSet = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  UUID: string;
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
