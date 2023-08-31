"use client";
import { currentCardIndexAtom, cardsLengthAtom } from "@/app/jotai/createProblems";
import {useAtomValue} from "jotai";


export default function CurrentCardIndicator() {

  const currentIndex = useAtomValue(currentCardIndexAtom);
  const cardLength = useAtomValue(cardsLengthAtom);

  return (
    <p className="text-center mb-5 text-3xl">
      {currentIndex + 1}번째 문제 / 총 {cardLength}개
    </p>
  );
}