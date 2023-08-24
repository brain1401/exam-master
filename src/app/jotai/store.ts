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
    additiondalViewClicked: false,
    imageButtonClicked: false,
    image: null,
    candidates: Array(4).fill({ text: "", isAnswer: false }),
    subAnswer: null,
  }),
]);

