import { atom } from "jotai";
import { Card } from "../types/card";

export const isNavbarMenuOpenAtom = atom(false);
export const cardsLengthAtom = atom("10");
export const currentCardIndexAtom = atom(0);
export const problemsSetsNameAtom = atom("");

export const cardsAtom = atom<Card[]>([
  ...Array(10).fill({
    type: "obj",
    question: "",
    additionalView: "",
    isAdditiondalViewButtonClicked: false,
    isImageButtonClicked: false,
    image: null,
    candidates: Array(4).fill({ text: "", isAnswer: false }),
    subAnswer: null,
  }),
]);

export const currentCardAtom = atom(
  (get) => {
    const cards = get(cardsAtom);
    const currentCardIndex = get(currentCardIndexAtom);
    return cards[currentCardIndex];
  },
  (get, set, update: Partial<Card>) => {
    const cards = get(cardsAtom);
    const currentCardIndex = get(currentCardIndexAtom);
    const newCards = [...cards];
    newCards[currentCardIndex] = {
      ...newCards[currentCardIndex],
      ...update,
    };
    set(cardsAtom, newCards);
  }
);

export const currentCardCandidatesAtom = atom(
  (get) => {
    const currentCard = get(currentCardAtom);
    return currentCard.candidates;
  },
  (get, set, updatedCandidates: Card["candidates"]) => {
    const currentCard = get(currentCardAtom);
    const newCurrentCard = {
      ...currentCard,
      candidates: updatedCandidates,
    };
    set(currentCardAtom, newCurrentCard);
  }
);

export const currentCardImageAtom = atom(
  (get) => {
    const currentCard = get(currentCardAtom);
    return currentCard.image;
  },
  (get, set, updatedImage: Card["image"]) => {
    const currentCard = get(currentCardAtom);
    const newCurrentCard = {
      ...currentCard,
      image: updatedImage,
    };
    set(currentCardAtom, newCurrentCard);
  }
);



export const resetCardsAtom = atom(null, (get, set) => {
  const cardsLength = get(cardsLengthAtom);
  const newCards = [...Array(parseInt(cardsLength)).fill({
    type: "obj",
    question: "",
    additionalView: "",
    additiondalViewClicked: false,
    imageButtonClicked: false,
    image: null,
    candidates: Array(4).fill({ text: "", isAnswer: false }),
    subAnswer: null,
  })];
  set(cardsAtom, newCards);
});
