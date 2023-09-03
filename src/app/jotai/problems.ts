import { atom } from "jotai";
import { Card, ProblemSetResponse } from "../../types/card";
import { atomsWithQuery } from "jotai-tanstack-query";

import axios from "axios";
export const isNavbarMenuOpenAtom = atom(false);
export const cardsLengthAtom = atom("10");
export const currentCardIndexAtom = atom(0);
export const problemSetNameAtom = atom("");

export const cardsAtom = atom<Card[]>([...Array<Card>(10).fill(null)]);

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
      ...(newCards[currentCardIndex] as NonNullable<Card>),
      ...update,
    };
    set(cardsAtom, newCards);
  }
);

export const currentCardCandidatesAtom = atom(
  (get) => {
    const currentCard = get(currentCardAtom);
    return currentCard?.candidates ?? null;
  },
  (get, set, updatedCandidates: NonNullable<Card>["candidates"]) => {
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
    return currentCard?.image;
  },
  (get, set, updatedImage: NonNullable<Card>["image"]) => {
    const currentCard = get(currentCardAtom);
    const newCurrentCard = {
      ...currentCard,
      image: updatedImage,
    };
    set(currentCardAtom, newCurrentCard);
  }
);

export const resetCardsAtom = atom(null, (get, set) => {
  const newCards = [...Array<Card>(10).fill(null)];
  set(cardsAtom, newCards);
  set(currentCardIndexAtom, 0);
  set(problemSetNameAtom, "");
  set(cardsLengthAtom, "10");
});

export const problemSetCurrentPageAtom = atom(1);

export const [problemSetAtomsWithQuery] = atomsWithQuery((get) => ({
  queryKey: ["problemSets", get(problemSetCurrentPageAtom)],
  queryFn: async ({ queryKey: [, page] }) => {
    if (typeof window === "undefined") return null;
    const res = await axios.get("/api/getProblemSets", {
      params: {
        page,
      },
    });
    return res.data as ProblemSetResponse;
  },
}));
