export type candidate = {
  text: string;
  isAnswer: boolean;
};

export type Card = {
  type: "obj" | "sub";
  question: string;
  additionalView: string;
  image: File | null;
  additiondalViewClicked: boolean;
  imageButtonClicked: boolean;
  candidates: candidate[] | null;
  subAnswer: string | null;
};
