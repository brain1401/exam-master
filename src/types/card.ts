export type candidate = {
  text: string;
  isAnswer: boolean;
};

export type Card = {
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  image: File | null;
  isAdditiondalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  candidates: candidate[] | null;
  subAnswer: string | null;
} | null;