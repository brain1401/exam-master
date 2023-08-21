import { Card } from "@/app/components/CreateProblems";
import React, { createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type CardContextType = {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const CardContext = createContext<CardContextType | undefined>(
  undefined
);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

export default function CardProvider({
  children,
  cards,
  setCards,
  currentIndex,
  setCurrentIndex,
}: Props) {
  return (
    <CardContext.Provider
      value={{ cards, setCards, currentIndex, setCurrentIndex }}
    >
      {children}
    </CardContext.Provider>
  );
}
