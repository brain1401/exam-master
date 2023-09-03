"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { currentCardIndexAtom, cardsLengthAtom } from "@/app/jotai/problems";

export default function NextOrPrevButtons() {
  const setCurrentIndex = useSetAtom(currentCardIndexAtom);
  const maxIndex = useAtomValue(cardsLengthAtom);

  const showNextCard = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < parseInt(maxIndex) - 1) {
        window.scrollTo(0, 0);
        return prevIndex + 1;
      } else {
        return prevIndex;
      }
    });
  };

  const showPreviousCard = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex !== 0) {
        window.scrollTo(0, 0);
        return prevIndex - 1;
      } else {
        return prevIndex;
      }
    });
  };

  return (
    <div className="flex justify-center mt-8 gap-5">
      <button
        onClick={showPreviousCard}
        className="px-5 py-2 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
      >
        이전
      </button>
      <button
        onClick={showNextCard}
        className="px-5 py-2 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
      >
        다음
      </button>
    </div>
  );
}
