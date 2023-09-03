import { candidate } from "./card";

export type Problem = {
  additionalView: string;
  candidates: candidate[];
  createdAt: string;
  id: string;
  question: string;
  questionType: "obj" | "sub";
  subjectiveAnswer: string;
  updatedAt: string;
  image: {
    id: string;
    url: string;
  };
  uuid: string;
}