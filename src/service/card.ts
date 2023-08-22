import { Card } from "@/app/types/card";

export const isCardEmpty = (card: Card) => {
  if (card.question === "") {
    console.log("question is empty");
    return true;
  }

  if (
    card.candidates === null ||
    card.candidates.some((candidate) => candidate.text === "")
  ) {
    console.log("candidate is empty");
    return true;
  }

  if (!card.candidates?.some((candidate) => candidate.isAnswer === true)) {
    console.log("answer is empty");
    return true;
  }
  return false;
};
